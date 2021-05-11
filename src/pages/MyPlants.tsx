import React, { useEffect, useState } from 'react'
import {
    Image,
    StyleSheet,
    Text,
    View,
    FlatList,
    ScrollView,
    Alert
} from 'react-native';
import { loadPlant, PlantProps, removePlant, StoragePlantProps } from '../libs/storage';
import { formatDistance } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Header } from '../componets/Header';
import { PlantCardSecondary } from '../componets/PlantCardSecondary';
import { Load } from '../componets/Load';

import colors from '../styles/colors';
import fonts from '../styles/fonts';
import waterdrop from '../assets/waterdrop.png';
import AsyncStorage from '@react-native-async-storage/async-storage';



export function MyPlants() {

    const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [nextWaterd, setNextWatered] = useState<string>();

    function handleRemove(plant: PlantProps) {
        Alert.alert('Remover', `Deseja remover a ${plant.name}?`, [
            {
                text: 'não 😰',
                style: 'cancel'
            },
            {
                text: 'Sim 👍',
                onPress: async () => {
                    try {
                        await removePlant(plant.id);
                        setMyPlants((oldData) => (
                            oldData.filter((item) => item.id != plant.id)
                        ));
                    } catch (error) {
                        Alert.alert('Não foi possivel remover!')
                    }
                }
            }
        ])
    }
    useEffect(() => {
        async function loadStorageData() {
            const plantsStoraged = await loadPlant();
            if (plantsStoraged.length > 0) {
                const horaReg = new Date(plantsStoraged[0].dateTimeNotification).getTime();
                const agora = new Date().getTime();
                if (horaReg > agora) {
                    const nextTime = formatDistance(
                        horaReg,
                        agora,
                        { locale: pt }
                    );
                    setNextWatered(
                        `Não esqueça de regar a ${plantsStoraged[0].name} em ${nextTime}.`
                    );
                } else if (horaReg == agora) {
                    setNextWatered(
                        `Está na hora de regar a ${plantsStoraged[0].name}.`
                    );
                } else if (horaReg < agora) {
                    const nextTime = formatDistance(
                        horaReg,
                        agora,
                        { locale: pt }
                    );
                    setNextWatered(
                        `Hey, não esqueça de regar a ${plantsStoraged[0].name}, ja se passaram ${nextTime}.`
                    );
                }
            } else {
                setNextWatered(
                    `Você não possui nem uma plantinha. Adicione uma planta para eu te ajudar a cuidar.`
                );
            }
            setMyPlants(plantsStoraged);
            setLoading(false);
        }
        loadStorageData();
    }, [myPlants])

    if (loading)
        return <Load />

    return (
        <View
            style={styles.container}
        >
            <Header />
            <View style={styles.spotLight}>
                <Image
                    source={waterdrop}
                    style={styles.spotLightImage}

                />
                <Text style={styles.spotLightText}>
                    {nextWaterd}
                </Text>
            </View>

            <View style={styles.plants}>
                {myPlants.length > 0 && (
                    <>
                        <Text style={styles.plantsTitle}>
                            Próximas regadas
                        </Text>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ flex: 1 }}
                            data={myPlants}
                            keyExtractor={(item) => String(item.id)}
                            renderItem={({ item }) => (
                                <PlantCardSecondary
                                    data={item}
                                    handleRemove={() => { handleRemove(item) }}
                                />
                            )}

                        />
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingTop: 50,
        backgroundColor: colors.background
    },
    spotLight: {
        backgroundColor: colors.blue_light,
        paddingHorizontal: 20,
        borderRadius: 20,
        height: 110,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    spotLightImage: {
        width: 60,
        height: 60,
    },
    spotLightText: {
        flex: 1,
        color: colors.blue,
        paddingHorizontal: 20,
    },
    plants: {
        flex: 1,
        width: '100%',
    },
    plantsTitle: {
        fontSize: 24,
        fontFamily: fonts.heading,
        color: colors.heading,
        marginVertical: 20
    }
})