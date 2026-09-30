import {
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
} from 'react-native'

import React, { useEffect, useState } from 'react'
import { Kanal7Data } from '../types/kanal7-data'
import { API_URL } from '@env';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/Ionicons';
import WebView from 'react-native-webview';
import { fullWidth } from '../constants/constants';

// Oynatıcı alt kontrol çubuğu yüksekliği
const BAR_HEIGHT = 56;

const playerCss = `
  .media-control[data-media-control] .media-control-layer[data-controls] {
    height: ${BAR_HEIGHT}px !important;
  }
  .media-control[data-media-control] .media-control-layer[data-controls] button.media-control-button,
  .media-control[data-media-control] .media-control-layer[data-controls] .media-control-indicator,
  .media-control[data-media-control] .media-control-layer[data-controls] .media-control-left-panel,
  .media-control[data-media-control] .media-control-layer[data-controls] .media-control-right-panel {
    height: ${BAR_HEIGHT}px !important;
    line-height: ${BAR_HEIGHT}px !important;
  }
  .media-control[data-media-control] .media-control-layer[data-controls] .media-control-icon {
    font-size: 28px !important;
  }
  .media-control[data-media-control] .media-control-layer[data-controls] .media-control-indicator[data-live] {
    font-size: 14px !important;
  }
`;

const injectedJS = `
  (function() {
    function addStyle() {
      if (document.getElementById('custom-player-style')) return;
      var style = document.createElement('style');
      style.id = 'custom-player-style';
      style.innerHTML = \`${playerCss}\`;
      document.head.appendChild(style);
    }
    addStyle();
    var tries = 0;
    var timer = setInterval(function() {
      addStyle();
      if (++tries > 20) clearInterval(timer);
    }, 500);
  })();
  true;
`;

const Home = () => {
    const [data, setData] = useState<Kanal7Data>()
    const { width } = useWindowDimensions()

    useEffect(() => {
        const getData = async () => {
            try {
                console.log('API_URL:', API_URL)
                const response = await fetch(API_URL + '/main-page.php')
                const json: Kanal7Data = await response.json()
                console.log('JSON:', JSON.stringify(json).slice(0, 300))
                setData(json)
            } catch (error) {
                console.log('HATA:', error)
            }
        }

        getData()
    }, [])

    return (
        <ScrollView style={{ flex: 1 }}>
            <LinearGradient
                colors={['#2563EB', '#7C3AED', '#EC4899']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ padding: 10, paddingBottom: 30 }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <AntDesign name='play-circle-outline' size={32} color={'#fff'} />
                    <Text style={styles.liveText}>CANLI YAYIN</Text>
                </View>

                <WebView
                    source={{ uri: 'https://www.kanal7.com/canli-yayin-iframe.php' }}
                    style={{ height: 200 }}
                    allowsFullscreenVideo
                    mediaPlaybackRequiresUserAction={false}
                    javaScriptEnabled
                    injectedJavaScript={injectedJS}
                    injectedJavaScriptForMainFrameOnly={false}
                    injectedJavaScriptBeforeContentLoadedForMainFrameOnly={false}
                />
            </LinearGradient>

            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
            >
                {data?.headlines?.map((program, index) => (
                    <ImageBackground
                        key={index}

                        source={{ uri: program.images.default }}
                        style={{ width: fullWidth, height: 200 }}
                        resizeMode="cover"
                    >
                        <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)', height: '100%' }} >
                            <Text>321</Text>
                        </View>
                    </ImageBackground>
                ))}
            </ScrollView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    liveText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 24,
        marginVertical: 8,
        marginLeft: 5
    },
});

export default Home;