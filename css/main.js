import { StyleSheet } from 'react-native';
import Dims from '../utils/dimensions';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 50,
    width: 300,
    textAlign: 'center',
    fontSize: 21
  },
  bottom_button:{
    backgroundColor:'#01567c',
    marginLeft:50,
    marginRight:50,
    marginBottom:80,
    alignItems:'center',
    paddingTop:10,
    paddingBottom:15,
    borderRadius:10
  },
  bottom_button_text:{
    color:'#fff2cd',
    fontSize:24
  },
  window_container:{
    position:'absolute',
    top:0,
    left:0,
    width:Dims.width(1),
    height:Dims.height(1),
    zIndex:1000
  },
  close_container:{
    position:'absolute',
    top:0,
    right:0,
    width:Dims.pixel(100),
    height:Dims.pixel(100),
    justifyContent:'center',
    alignItems:'center',
    zIndex:1000
  },
  close_btn:{
    fontSize:Dims.pixel(100),
    color:'red'
  }
});
