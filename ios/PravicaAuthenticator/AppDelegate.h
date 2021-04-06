#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import <React/RCTEventEmitter.h>

@interface AppDelegate : UIResponder  <UIApplicationDelegate, RCTBridgeDelegate> 
@property (nonatomic, strong) UIWindow *window;
- (void)sendEventWithName:(NSString *)eventName body:(id)body;
@end

