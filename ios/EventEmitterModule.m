#import "EventEmitterModule.h"
#import <React/RCTLog.h>

@implementation EventEmitterModule
//constructor as "Singleton pattern" = 1 class EventEmitterModule => 1 object TaskManager
+(id)allocWithZone:(NSZone *)zone {
  static EventEmitterModule *shared = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    shared = [super allocWithZone:zone];
  });
  return shared;
}
RCT_EXPORT_MODULE();//Use "EventEmitterModule" as module's name

//Send some events from Objective C to React Native
- (NSArray<NSString *> *)supportedEvents {
  return @[@"Linking"];//maybe 2,3,4,... events
}
@end
