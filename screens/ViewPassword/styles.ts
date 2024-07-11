import {StyleSheet} from 'react-native'
import Colors from '../../colors'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: Colors.light,
      },
      passwordItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        marginVertical: 8,
        backgroundColor: Colors.white,
        borderRadius: 10,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
      },
      website: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.dark,
      },
      password: {
        fontSize: 14,
        color: Colors.dark,
      },
      addButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: Colors.primary,
        borderRadius: 50,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
      },
      clipboardContainer :{
        position:'absolute',
        right:50,
        paddingRight:3
    }
})
export default styles