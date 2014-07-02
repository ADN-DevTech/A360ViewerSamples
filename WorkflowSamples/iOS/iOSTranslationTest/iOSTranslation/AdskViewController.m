//
//  AdskViewController.m
//  iOSTranslation
//
//  Created by Adam Nagy on 23/05/2014.
//  Copyright (c) 2014 Adam Nagy. All rights reserved.
//

// DropBox access
#import <DBChooser/DBChooser.h>

#include "_UserSettings.h"

/*
 Have a look at these links to know how to integrate DropBox into your app:
 - http://www.mathiastauber.com/integration-o-dropbox-in-your-ios-application/
 - https://www.dropbox.com/developers/dropins/chooser/ios
 */

#import "AdskViewController.h"

@interface AdskViewController ()

@end

@implementation AdskViewController

#define kApiUrl @"https://developer.api.autodesk.com"

- (void)viewDidLoad
{
  [super viewDidLoad];
	// Do any additional setup after loading the view, typically from a nib.
  
  // Load stored data
  NSUserDefaults * prefs = [NSUserDefaults standardUserDefaults];
  NSString * urn64 = [prefs objectForKey:@"urn64"];
  if (urn64)
    self.fileUrn64 = urn64;
}

- (void)didReceiveMemoryWarning
{
  [super didReceiveMemoryWarning];
  // Dispose of any resources that can be recreated.
}

- (NSDictionary*)httpTo:(NSString *)url
                   data:(NSData*)data
            contentType:(NSString*)contentType
                 method:(NSString*)method
             statusCode:(NSInteger*)statusCode
{
  NSMutableURLRequest * req =
  [[NSMutableURLRequest alloc]
   initWithURL:[NSURL URLWithString:url]];
  
  [req setHTTPMethod:method];
  [req
   setValue:contentType
   forHTTPHeaderField:@"Content-Type"];
  
  [req setHTTPBody:data];
  
  NSHTTPURLResponse * response;
  NSError * error = nil;
  NSData * result =
  [NSURLConnection
   sendSynchronousRequest:req
   returningResponse:&response
   error:&error];
  
  NSLog(@"Response code: %ld, for url: %@",
        (long)[response statusCode], url);
  
  if (statusCode)
    *statusCode = [response statusCode];
  
  NSDictionary * json =
  [NSJSONSerialization
   JSONObjectWithData:result
   options:NSJSONReadingMutableContainers
   error:&error];
  
  if (statusCode && *statusCode == 0)
    self.progress.text = [json objectForKey:@"developerMessage"];
  
  NSLog(@"json = %@", json);
  
  return json;
}

- (IBAction)logIn:(id)sender
{
  // We'll need this to do further interaction with the API
  while (true)
  {
    NSString * body =
    [[NSString stringWithFormat:
      @"client_id=%@&client_secret=%@&grant_type=client_credentials",
      kConsumerKey, kSecretKey]
     stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    
    NSDictionary * json =
    [self
     httpTo: kApiUrl
     "/authentication/v1/authenticate"
     data: [body dataUsingEncoding:NSUTF8StringEncoding]
     contentType:@"application/x-www-form-urlencoded"
     method:@"POST" statusCode:nil];
    
    self.accessToken.text = [json objectForKey:@"access_token"];
    
    body =
    [[NSString stringWithFormat:
      @"access-token=%@", self.accessToken.text]
     stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    
    NSInteger statusCode;
    
    json =
    [self
     httpTo: kApiUrl
     "/utility/v1/settoken"
     data: [body dataUsingEncoding:NSUTF8StringEncoding]
     contentType:@"application/x-www-form-urlencoded"
     method:@"POST" statusCode:&statusCode];
    
    // If the authentication token has issue then we'll try again
    if (statusCode == 200)
      break;
  }
}

- (IBAction)selectFile:(id)sender
{
  [[DBChooser defaultChooser]
   openChooserForLinkType:DBChooserLinkTypeDirect
   fromViewController:self
   completion:^(NSArray *results)
   {
     if ([results count]) {
       // Process results from Chooser
       DBChooserResult * result = [results objectAtIndex:0];
       NSURL * url = result.link;
       
       self.fileName.text = result.name;
       
       self.fileData = [NSData dataWithContentsOfURL:url];

     } else {
       // User canceled the action
     }
   }];
}

- (IBAction)uploadFile:(id)sender
{
  // Now we can try to create a bucket
  NSString * body =
  [NSString stringWithFormat:
   @"{ \"bucketKey\":\"mytestbucket\",\"policy\":\"transient\","
   "\"servicesAllowed\":{}}"];
  
  NSDictionary * json =
  [self
   httpTo: kApiUrl
   "/oss/v1/buckets"
   data: [body dataUsingEncoding:NSUTF8StringEncoding]
   contentType:@"application/json"
   method:@"POST" statusCode:nil];
  
  // Now we try to upload the file
  NSString * url =
  [NSString stringWithFormat:@"%@/%@",
   kApiUrl
   "/oss/v1/buckets/mytestbucket/objects",
   [self.fileName.text
    stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding]];
  
  json =
  [self
   httpTo: url
   data: self.fileData
   contentType:@"application/stream"
   method:@"PUT" statusCode:nil];
  
  NSDictionary * objects =
  [[json objectForKey:@"objects"] objectAtIndex:0];
  
  self.fileKey = [objects objectForKey:@"key"];
  self.fileSha1 = [objects objectForKey:@"sha-1"];
  self.fileId = [objects objectForKey:@"id"]; // includes urn:...
  
  NSLog(@"fileKey = %@", self.fileKey);
  NSLog(@"fileSha1 = %@", self.fileSha1);
  NSLog(@"fileId = %@", self.fileId);
  
  NSData * data = [self.fileId dataUsingEncoding:NSUTF8StringEncoding];
  self.fileUrn64 = [data base64EncodedStringWithOptions:0];
  NSLog(@"fileUrn64 = %@", self.fileUrn64);
  
  // Store in defaults so we can check on progress even after
  // restating application
  NSUserDefaults * prefs = [NSUserDefaults standardUserDefaults];
  [prefs setObject:self.fileUrn64 forKey:@"urn64"];
  [prefs synchronize];
  
  // Send for translation
  body = [NSString stringWithFormat: @"{\"urn\":\"%@\"}", self.fileUrn64];
  
  NSInteger statusCode;
  
  json =
  [self
   httpTo: kApiUrl
   "/viewingservice/v1/register"
   data: [body dataUsingEncoding:NSUTF8StringEncoding]
   contentType:@"application/json; charset=utf-8"
   method:@"POST" statusCode:&statusCode];
  
  self.uploadResult.text = [json objectForKey:@"Result"];
}

- (IBAction)checkProgress:(id)sender
{
  NSInteger statusCode;
  
  // Check progress
  NSString * url =
  [NSString stringWithFormat:@"%@%@",
   kApiUrl
   "/viewingservice/v1/",
   [self.fileUrn64 stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding]];
  NSDictionary * json =
  [self httpTo:url data:nil
   contentType:@"application/json" method:@"GET" statusCode:&statusCode];
  
  // If all was fine then write the result
  if (statusCode == 200)
    self.progress.text = [json objectForKey:@"progress"];
  
  // Try to get thumbnail
  url =
  [NSString stringWithFormat:@"%@%@",
   kApiUrl
   "/viewingservice/v1/thumbnails/",
   [self.fileUrn64 stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding]];
  NSData * data = [NSData dataWithContentsOfURL:[NSURL URLWithString: url ] ];
  
  self.thumbnail.image = [UIImage imageWithData:data];
}

@end
