//
//  AdskViewController.h
//  iOSTranslation
//
//  Created by Adam Nagy on 23/05/2014.
//  Copyright (c) 2014 Adam Nagy. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface AdskViewController : UIViewController

@property (strong, nonatomic) NSData * fileData;
@property (strong, nonatomic) NSString * fileSha1;
@property (strong, nonatomic) NSString * fileKey;
@property (strong, nonatomic) NSString * fileUrn64;
@property (strong, nonatomic) NSString * fileId;

@property (weak, nonatomic) IBOutlet UILabel *accessToken;
@property (weak, nonatomic) IBOutlet UILabel *fileName;
@property (weak, nonatomic) IBOutlet UIImageView *thumbnail;
@property (weak, nonatomic) IBOutlet UILabel *progress;
@property (weak, nonatomic) IBOutlet UILabel *uploadResult;

@end
