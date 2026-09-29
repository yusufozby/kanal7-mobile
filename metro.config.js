const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
    transformer: {
        // Worklet'lerin çalışma zamanında (runtime) doğru şekilde optimize 
        // edilip yüklenmesi için bu ayarın true olması kritik önem taşır.
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: true, // <--- BU SATIRI EKLEYİN VEYA TRUE YAPIN
            },
        }),
    },
};
module.exports = mergeConfig(getDefaultConfig(__dirname), config);
