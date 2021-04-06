#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h> //RCT = React
#import <React/RCTEventEmitter.h>

NS_ASSUME_NONNULL_BEGIN

@interface EventEmitterModule : RCTEventEmitter<RCTBridgeModule>

@end

NS_ASSUME_NONNULL_END
