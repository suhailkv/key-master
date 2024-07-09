import { View, Text, StyleSheet } from 'react-native';

interface FadingContainerProps {
  message: string | null;
}

const FadingContainer: React.FC<FadingContainerProps> = ({ message }) => {
 
return (
  message &&
    <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{message}</Text>
    </View>
)

};

const styles = StyleSheet.create({
  errorContainer:   {
    position: 'absolute',
    top: 20, 
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  errorText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default FadingContainer;
