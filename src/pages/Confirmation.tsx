import React from 'react'
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/core';
import { Button } from '../componets/Button'
import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface Parms {
    title: string,
    subTitle: string,
    buttonTitle: string,
    icon: 'smile' | 'hug',
    nextScreen: string
}


const emojis = {
    hug: '🤗',
    smile: '😄'
}

export function Confirmation() {

    const navigation = useNavigation();
    const routes = useRoute();

    const {
        title,
        subTitle,
        buttonTitle,
        icon,
        nextScreen
    } = routes.params as Parms;

    function handleComecar() {
        navigation.navigate(nextScreen);
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.emoji}>
                    {emojis[icon]}
                </Text>
                <Text style={styles.title}>
                    {title}
                </Text>
                <Text style={styles.subTitle}>
                    {subTitle}
                </Text>
                <View style={styles.footer}>
                    <Button text={buttonTitle} onPress={handleComecar} />
                </View>
            </View>
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    content: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30
    },
    title: {
        fontSize: 22,
        lineHeight: 28,
        textAlign: 'center',
        color: colors.heading,
        fontFamily: fonts.heading,
        marginTop: 20
    },
    emoji: {
        fontSize: 38
    },
    subTitle: {
        fontFamily: fonts.text,
        textAlign: 'center',
        fontSize: 12,
        paddingVertical: 10,
        color: colors.heading
    },
    footer: {
        width: '100%',
        marginTop: 20,
        paddingHorizontal: 40

    }

});