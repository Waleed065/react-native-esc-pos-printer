#if RCT_NEW_ARCH_ENABLED
#import "RNEscPosPrinterSpec.h"

@interface EscPosPrinterEasySelect : NativeEscPosPrinterEasySelectSpecBase<NativeEscPosPrinterEasySelectSpec>

@end

#else

#import <React/RCTBridgeModule.h>
@interface EscPosPrinterEasySelect : NSObject <RCTBridgeModule>

@end

#endif
