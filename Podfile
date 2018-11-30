# Uncomment the next line to define a global platform for your project
# platform :ios, '9.0'

target 'br4' do
  # Uncomment the next line if you're using Swift or would like to use dynamic frameworks
  # use_frameworks!

  # Pods for br4

  pod 'yoga', :path => '../node_modules/react-native/ReactCommon/yoga'

  pod 'React', :path => '../node_modules/react-native', :subspecs => [
    'RCTText',
    'RCTImage',
    'RCTNetwork',
    'RCTWebSocket',
  ]

  pod 'react-native-amplitude-analytics', :path => '../node_modules/react-native-amplitude-analytics'

  pod 'RNDeviceInfo', :path => '../node_modules/react-native-device-info'

  pod 'react-native-in-app-utils', :path => '../node_modules/react-native-in-app-utils'

  pod 'react-native-appsflyer', :path => '../node_modules/react-native-appsflyer'

  target 'br4Tests' do
    inherit! :search_paths
    # Pods for testing
  end

end