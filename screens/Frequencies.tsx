import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    Platform,
} from 'react-native';
import { useNavigation, ParamListBase } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import { baseApi } from '../constants/constants';
import { COLORS } from '../constants/colorschema';

// ---------- Tipler ----------
export interface SatelliteInfo {
    satellite: string;
    frequency: string;
    symbol: number;
    polarization: string;
    fec: string;
}

export interface FrekansData {
    sd: SatelliteInfo;
    hd: SatelliteInfo;
    europe: SatelliteInfo;
    platforms: {
        digiturk: number;
        dsmart: number;
        tivibu: { sd: number; hd: number };
        'analog-cable-tv': number;
        'cable-tv': { sd: number; hd: number };
    };
    contact: {
        tel1: string;
        tel2: string;
        tel_free1: string;
        tel_free2: string;
    };
}

interface SectionItem {
    title: string;
    lines: string[];
}

interface SectionProps extends SectionItem {
    last: boolean;
}

interface MenuButtonProps {
    onPress?: () => void;
}

// ---------- Sabitler ----------


// API'ye ulaşılamazsa gösterilecek varsayılan veri
const DEFAULT_DATA: FrekansData = {
    sd: { satellite: 'Türksat 4A', frequency: '12.095', symbol: 4800, polarization: 'Yatay (Horz)', fec: '5/6' },
    hd: { satellite: 'Türksat 4A', frequency: '12.103', symbol: 8333, polarization: 'Yatay ( Horz )', fec: '2/3' },
    europe: { satellite: 'Türksat 4A', frequency: '12236', symbol: 4000, polarization: 'Dikey ( Vertical )', fec: '5/6' },
    platforms: {
        digiturk: 34,
        dsmart: 27,
        tivibu: { sd: 28, hd: 317 },
        'analog-cable-tv': 13,
        'cable-tv': { sd: 903, hd: 27 },
    },
    contact: {
        tel1: '0212 437 80 80',
        tel2: '0553 244 70 32',
        tel_free1: '0800 261 91 14',
        tel_free2: '0800 211 20 88',
    },
};

// ---------- Bileşenler ----------
const MenuButton: React.FC<MenuButtonProps> = ({ onPress }) => (
    <TouchableOpacity style={styles.menuBtn} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.bar} />
        <View style={styles.bar} />
        <View style={styles.bar} />
        <Text style={styles.menuLabel}>MENÜ</Text>
    </TouchableOpacity>
);

const Section: React.FC<SectionProps> = ({ title, lines, last }) => (
    <View style={[styles.section, !last && styles.sectionDivider]}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.sectionBody}>
            {lines.map((line, i) => (
                <Text key={i} style={styles.line}>
                    {line}
                </Text>
            ))}
        </View>
    </View>
);

const satLines = (s: SatelliteInfo): string[] => [
    s.satellite,
    `Frekans ${s.frequency}`,
    s.polarization,
    `Symbol Rate ${s.symbol}`,
];

// ---------- Ekran ----------
const Frequencies: React.FC = () => {
    const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
    const [data, setData] = useState<FrekansData>(DEFAULT_DATA);

    useEffect(() => {
        let cancelled = false;

        fetch(baseApi + "/frequencies.php")
            .then((r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json() as Promise<FrekansData>;
            })
            .then((json) => {
                if (!cancelled) setData(json);
            })
            .catch(() => {
                // Hata olursa varsayılan veri gösterilmeye devam eder
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const sections = useMemo<SectionItem[]>(() => {
        const p = data.platforms;
        const c = data.contact;
        return [
            { title: 'KANAL 7 SD FREKANSI', lines: satLines(data.sd) },
            { title: 'KANAL 7 HD FREKANSI', lines: satLines(data.hd) },
            { title: 'KANAL 7 EUROPE FREKANSI', lines: satLines(data.europe) },
            {
                title: 'PLATFORMLAR',
                lines: [
                    `DIGITURK: ${p.digiturk}`,
                    `D-SMART: ${p.dsmart}`,
                    `TIVIBU HD YAYIN: ${p.tivibu.hd} (SD Yayın: ${p.tivibu.sd})`,
                    `ANALOG KABLO TV: ${p['analog-cable-tv']}`,
                    `KABLO TV: ${p['cable-tv'].hd} (SD Yayın: ${p['cable-tv'].sd})`,
                ],
            },
            { title: 'TEKNİK DESTEK HATTI', lines: [c.tel1, c.tel2] },
            { title: 'ÜCRETSİZ HATLAR', lines: [c.tel_free1, c.tel_free2] },
        ];
    }, [data]);
    useLayoutEffect(() => {
        navigation.setOptions({ title: 'FREKANS BİLGİLERİ' });
    }, [navigation]);

    return (
        <View style={styles.root}>

            <ScrollView contentContainerStyle={styles.content}>
                {sections.map((s, i) => (
                    <Section
                        key={s.title}
                        title={s.title}
                        lines={s.lines}
                        last={i === sections.length - 1}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

export default Frequencies;

// ---------- Stiller ----------
const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#FFFFFF' },

    headerSafe: {
        backgroundColor: COLORS.primary,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0,
    },
    header: {
        height: 72,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: COLORS.primary,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '800',
    },
    headerSpacer: { width: 44 },

    menuBtn: { width: 44, alignItems: 'center', justifyContent: 'center' },
    bar: {
        width: 28,
        height: 3.5,
        borderRadius: 2,
        backgroundColor: '#FFFFFF',
        marginVertical: 2.5,
    },
    menuLabel: { color: '#FFFFFF', fontSize: 11, marginTop: 4 },

    content: { paddingHorizontal: 20, paddingBottom: 32 },

    section: { paddingVertical: 22 },
    sectionDivider: {
        borderBottomWidth: StyleSheet.hairlineWidth * 2,
        borderBottomColor: '#E2E2E2',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#111111',
        marginBottom: 12,
    },
    sectionBody: { paddingLeft: 20 },
    line: {
        fontSize: 18,
        lineHeight: 25,
        color: '#333333',
    },
});