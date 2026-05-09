import { FlatList, View, type ListRenderItem } from 'react-native';
import type { DeviceInfo } from 'react-native-esc-pos-printer';
import { PrinterItem } from '../PrinterItem';
import { styles } from './styles';

interface PrintersListProps {
  printers: DeviceInfo[];
  onPress: (printer: DeviceInfo) => void;
}

export const PrintersList = ({ printers, onPress }: PrintersListProps) => {
  const renderItem: ListRenderItem<DeviceInfo> = ({ item }) => {
    return <PrinterItem printer={item} onPress={onPress} />;
  };

  return (
    <View style={styles.container}>
      <FlatList data={printers} renderItem={renderItem} />
    </View>
  );
};
