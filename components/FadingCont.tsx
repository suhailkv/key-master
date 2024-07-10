import { View, Text, StyleSheet } from 'react-native';

interface FadingContainerProps {
  message: string | null;
  timeout:number
  errFn : Function
}

const FadingContainer: React.FC<FadingContainerProps> = ({ message ,timeout,errFn}) => {
 setTimeout(()=>errFn(null),timeout)
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
    zIndex:1000
  },
  errorText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default FadingContainer;
