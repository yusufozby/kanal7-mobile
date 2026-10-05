import React, { useState } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useIsFocused } from '@react-navigation/native';

const STREAM_PAGE = 'https://www.kanal7.com/canli-yayin-iframe.php';

const LiveStream = () => {
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(true);

    return (
        <View style={styles.container}>
            <StatusBar hidden={isFocused} />

            {/* Ekrandan çıkınca WebView kaldırılır, yayın arka planda çalmaya devam etmez */}
            {isFocused && (
                <WebView
                    source={{ uri: STREAM_PAGE }}
                    style={styles.webview}
                    javaScriptEnabled
                    domStorageEnabled
                    allowsFullscreenVideo
                    allowsInlineMediaPlayback
                    mediaPlaybackRequiresUserAction={false}
                    mixedContentMode="always"
                    onLoadEnd={() => setLoading(false)}
                />
            )}

            {loading && (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#DB2227" />
                </View>
            )}
        </View>
    );
};

export default LiveStream;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    webview: {
        flex: 1,
        backgroundColor: '#000',
    },
    loader: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
});