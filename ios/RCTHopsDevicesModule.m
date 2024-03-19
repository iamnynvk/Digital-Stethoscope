//
//  RCTHopsDevicesModule.m
//  HopsDeviceApp
//
//  Created by Naitik Patel on 29/11/21.
//

#import <Foundation/Foundation.h>
#import <React/RCTLog.h>
#import "RCTHopsDevicesModule.h"
#import <HopsDevicesFramework/HopsDevicesFramework-Swift.h>
#import <HopsDevicesFramework/HopsDevicesFramework.h>

BleManager* bleManager;


@implementation RCTHopsDevicesModule

{
  bool hasListeners;
  
}

// Will be called when this module's first listener is added.
-(void)startObserving {
    hasListeners = YES;
    // Set up any upstream listeners or background tasks as necessary
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
    hasListeners = NO;
    // Remove upstream listeners, stop unnecessary background tasks
}

- (NSArray<NSString *> *)supportedEvents{

    return @[@"EventGetCurrentAmplitudeValue",@"EventStethoscopeRecordStartError"];
}

// To export a module named RCTHopsDevicesModule
RCT_EXPORT_MODULE(HopsDevicesModule);

RCT_EXPORT_METHOD(init:(NSString *) deviceName) {
  bleManager = [BleManager shared];
  if ([deviceName isEqualToString: @"Hops_Stetho"]) {
    [bleManager setupDeviceWithHopsDevice:HopsDeviceSTETHOSCOPE];
    RCTLogInfo(@"Vitals manager initialize with device:  %@", deviceName);
  }else{
    RCTLogInfo(@"Vitals manager initialize failed!");
  }
}

RCT_EXPORT_METHOD(setAudioFilterServerURL:(NSString *) audioFilterServerURL resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  NSLog(@"onMessage");
  [bleManager.stethoscope setAudioFilterServerURLWithAudioFilterServerURL:audioFilterServerURL onMessage:^(HopsDevice hopsDevice, OperationStatus operationStatus, id data) {
      
    NSString *strErrorCode = [bleManager getOperationStatusNameWithOperationStatus:operationStatus];
    
    reject(@"event_failure", strErrorCode, nil);
    
  }];}

RCT_EXPORT_METHOD(startRecording:(NSInteger) recoderTimeInSecond){
  
  RCTLogInfo(@"Vitals startRecording:  %ld", (long)recoderTimeInSecond);
  
  [bleManager.stethoscope recordStartDataOnData:^(HopsDevice hopsDevice, DeviceData * deviceData) {
    
    RCTLogInfo(@"=====amplitude:  %@", deviceData.stethoscopeData.currentAmplitudeValue);

    
    [self sendEventWithName:@"EventGetCurrentAmplitudeValue" body:@{@"amplitude": deviceData.stethoscopeData.currentAmplitudeValue,@"averagePower": deviceData.stethoscopeData.currentAveragePower,@"peakPower": deviceData.stethoscopeData.currentPeakPower}];
    
   //[self sendEventWithName:@"EventGetCurrentAmplitudeValue" body:@{@"amplitude": deviceData.stethoscopeData.currentAmplitudeValue}];
  } onMessage:^(HopsDevice hopsDevice, OperationStatus operationStatus, id data) {
    NSString *strErrorCode = [bleManager getOperationStatusNameWithOperationStatus:operationStatus];
    RCTLogInfo(@"=========stethoscopeRecordStart strErrorCode operationStatus : %ld", (long)operationStatus);

    RCTLogInfo(@"=========stethoscopeRecordStart strErrorCode : %@", strErrorCode);
    RCTLogInfo(@"=========stethoscopeRecordStart strErrorCode data : %@", data);

    if(data == nil) {
      data = @"";
    }
    [self sendEventWithName:@"EventStethoscopeRecordStartError" body:@{@"error_code": strErrorCode, @"data":data}];
  } recoderTimeInSecond:recoderTimeInSecond];
}


RCT_EXPORT_METHOD(stopRecording:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  [bleManager.stethoscope recordStopDataOnData:^(HopsDevice hopsDevice, DeviceData * deviceData) {
      NSLog(@"%@", deviceData.stethoscopeData.filePath);
    NSDictionary *dictData = @{ @"filePath" : deviceData.stethoscopeData.filePath, @"fileDurationInSeconds" : deviceData.stethoscopeData.fileDurationInSeconds};

    resolve(dictData);
  } onMessage:^(HopsDevice hopsDevice, OperationStatus operationStatus, id data) {
    NSString *strErrorCode = [bleManager getOperationStatusNameWithOperationStatus:operationStatus];
    //NSLog(@"onMessage");
    reject(@"event_failure", strErrorCode, nil);
  }];
}



@end
