import {StyleSheet} from 'react-native'
import Colors from '../../colors'

const styles = StyleSheet.create( { 
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: Colors.light,
    },
    inputContainer: {
        backgroundColor: Colors.white,
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.dark,
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: Colors.border,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        color: Colors.dark,
        paddingRight:40
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        borderRadius: 10,
        height: 50,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    saveButtonText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
        marginRight: 10,
    },
    arrowContainer: {
        marginTop: 0,
        alignItems:'flex-end',
    },
    arrow: {
        fontSize: 30,
    },
    eyeButton: {
        padding: 5,
        position:'relative',
        top:-70,
        right:-300,
        margin:0,
        zIndex:1000
      },
})
export default styles