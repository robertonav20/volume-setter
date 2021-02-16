import React, {Component} from 'react';
import {SafeAreaView, Switch, Text, TextInput, View} from 'react-native';
import Slider from '@react-native-community/slider';
import {volumeScreenStyles} from './Styles';
import {SimpleLineIcons,Ionicons,Octicons,AntDesign} from '@expo/vector-icons';
import {
    _activeMute,
    _disableMute,
    _getVolume,
    _refreshBasePath,
    _setVolume,
    HOSTNAME,
    PORT,
    PROTOCOL,
    PROTOCOLS,
    TIMEOUT
} from './Services';
import {showToast} from './Notification';

export default class VolumeScreen extends Component<{}, { volume: number, protocol: boolean, hostname: string, port: number }> {
    private volume: number = 50;
    private min: number = 0;
    private max: number = 100;

    private hostname: string = HOSTNAME;
    private protocols: string[] = PROTOCOLS;
    private protocol: boolean = PROTOCOL;
    private port: number = PORT;
    private timeout: number = TIMEOUT;

    constructor(props: {} | Readonly<{}>) {
        super(props);
        this.state = {
            volume: this.volume,
            protocol: this.protocol,
            hostname: this.hostname,
            port: this.port
        };

        this.load();
    }

    load = () => {
        this.getVolume();
    }

    _onPressButton = () => {
        showToast('Changed value!');
    }

    _toggleSwitch = () => {
        this.protocol = !this.protocol;
        this.setState({protocol: this.protocol})
        this.refreshBasePath();
    }

    refreshBasePath = () => {
        _refreshBasePath(this.protocol, this.hostname, this.port, this.timeout);
    }

    _onChangeHostname = (value: string) => {
        try {
            if (value) {
                this.setState({hostname: value})
                this.hostname = value;
                this.refreshBasePath();
            } else {
                showToast('The value not good! Cannot set a null value')
            }
        } catch (e) {
            showToast('Not valid value!')
        }
    }

    _onChangePort = (value: string) => {
        try {
            const port = Number(value);
            if (port) {
                this.setState({port: port})
                this.port = port;
                this.refreshBasePath();
            }
        } catch (e) {
            showToast('The value isn\'t not a number')
        }
    }

    _onChangeVolume = (value: number) => {
        try {
            if (value >= 0 && value <= 100) {
                this.setState({volume: value})
                this.volume = value;
            } else {
                showToast('The value not good! Set a value from 0 to 100')
            }
        } catch (e) {
            showToast('Not a value number!')
        }
    }

    _decreaseVolume = () => {
        if (this.volume > this.min) {
            this.setState({volume: this.volume - 1})
            this.volume -= 1
        } else {
            showToast('Cannot decrease volume, min is reached!')
        }
    }

    _increaseVolume = () => {
        if (this.volume < this.max) {
            this.setState({volume: this.volume + 1})
            this.volume += 1
        } else {
            showToast('Cannot increase volume, max is reached!')
        }
    }

    activeMute = () => {
        _activeMute();
    }

    disableMute = () => {
        _disableMute();
    }

    setVolume = () => {
        _setVolume(this.volume);
    }

    getVolume = () => {
        _getVolume()
            .then(volume => {
                this.volume = volume;
                this.setState({volume: this.volume})
            })
            .catch((error: any) => {
                this.volume = 50;
                this.setState({volume: this.volume})
            });
    }

    render() {
        return (
            <SafeAreaView style={volumeScreenStyles.container}>
                <View style={volumeScreenStyles.header}>
                    <View>
                        <Text style={volumeScreenStyles.volumeTitle}>
                            Volume
                        </Text>
                    </View>
                    <View>
                        <Text style={volumeScreenStyles.volumeValueTitle}>
                            {this.volume + '%'}
                        </Text>
                    </View>
                </View>
                <View style={volumeScreenStyles.content}>
                    <View style={volumeScreenStyles.parameters}>
                        <View style={volumeScreenStyles.fixToTextCenter}>
                            <Text style={volumeScreenStyles.protocolTextStyle}>{this.protocols[0]}</Text>
                            <Switch
                                trackColor={{false: "#767577", true: "#2198f2"}}
                                thumbColor={'#2198f2'}
                                ios_backgroundColor='#2198f2'
                                onValueChange={this._toggleSwitch}
                                value={this.state.protocol}
                            />
                            <Text style={volumeScreenStyles.protocolTextStyle}>{this.protocols[1]}</Text>
                        </View>
                        <View style={volumeScreenStyles.fixToTextCenter}>
                            <TextInput
                                style={volumeScreenStyles.textInputStyle}
                                onChangeText={this._onChangeHostname}
                                value={this.state.hostname}
                            />
                        </View>
                        <View style={volumeScreenStyles.fixToTextCenter}>
                            <TextInput
                                style={volumeScreenStyles.textInputStyle}
                                onChangeText={this._onChangePort}
                                value={String(this.state.port)}
                            />
                        </View>
                    </View>
                    <View style={volumeScreenStyles.configuration}>
                        <View style={volumeScreenStyles.fixToText}>
                            <View style={[{width: "20%"}]}>
                                <SimpleLineIcons.Button onPress={this._decreaseVolume} name="volume-1" size={24} color="white" style={volumeScreenStyles.iconVolumeButton}/>
                            </View>
                            <View style={volumeScreenStyles.fixToText}>
                                <Slider
                                    style={{width: 200, height: 40}}
                                    minimumValue={0}
                                    maximumValue={100}
                                    minimumTrackTintColor={'#2198f2'}
                                    thumbTintColor={'#2198f2'}
                                    value={this.state.volume}
                                    step={1}
                                    onValueChange={this._onChangeVolume}
                                />
                            </View>
                            <View style={[{width: "20%"}]}>
                                <SimpleLineIcons.Button onPress={this._increaseVolume} name="volume-2" size={24} color="white" style={volumeScreenStyles.iconVolumeButton}/>
                            </View>
                        </View>
                        <View style={volumeScreenStyles.title}>
                            <AntDesign.Button onPress={this.setVolume} name="upload" size={24} color="white" style={volumeScreenStyles.iconVolumeButton}/>
                        </View>
                        <View style={volumeScreenStyles.fixToText}>
                            <View style={[{width: "30%"}]}>
                                <Ionicons.Button onPress={this.activeMute} name="volume-mute" size={24} color="white" style={volumeScreenStyles.iconVolumeButton}/>
                            </View>
                            <View style={[{width: "30%"}]}>
                                <Octicons.Button onPress={this.disableMute} name="unmute" size={24} color="white" style={volumeScreenStyles.iconVolumeButton}/>
                            </View>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}