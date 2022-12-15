import React from "react";
import { Animated, PanResponder, StyleSheet, Text, View } from "react-native";

export default Slider = (props) => {

  /* 
  * -------------------- OPTIONS -------------------------------- 
  *  (Utilice props._VALUE_ en esta sección si es necesario)
  * 
  * */

  const name = "-";
  const icon = "ticket-percent-outline";
  const minBoundary = 30;
  const maxBoundary = 100;
  const min_initVal = 30;
  const max_initVal = 50;
  const colorNeutral = '#f1f1f1';
  const colorHighlight = '#008ee6';

  // La siguiente línea es la diferencia de posición del deslizador min y el deslizador max
  // Para evitar la superposición y el bloqueo en el valor del límite máximo
  // Mantener entre 0.10 y 0.40 para una mejor experiencia de usuario

  const manualOffsetBetweenSlider = 0.10;

  /*
  * --------------------------- EN COMÚN -----------------------------------
  *
  *  */

  const [forceRender, setForceRender] = React.useState(0);
  const [sliderHeight, setSliderHeight] = React.useState(0);
  const [sliderWidth, setSliderWidth] = React.useState(0);
  const [sliderCenter, setSliderCenter] = React.useState(0);
  const [isTouchable, setIsTouchable] = React.useState(false);

  const initSliders = (alto, ancho) => {

    /*
     * Establecer tamaños
     *
     * */
    
    let sWidth = ancho - alto; // - altura : Evita que el deslizador se superponga a los bordes
    const center = sWidth / 2;
    const stepWidth = sWidth / (maxBoundary - minBoundary);
    setSliderHeight(alto);
    setSliderWidth(sWidth);
    setSliderCenter(center);

    // Deslizador mínimo inicial
    const min_initOff = (min_initVal - ((maxBoundary - minBoundary) / 2)) * stepWidth;
    min_setInitOffset(min_initOff);
    const minPos = (-sWidth/2) - min_initOff;
    min_setMinBoundaryPosition(minPos);
    min_setMaxBoundaryPosition(minPos + sWidth);
    min_animState.sliderHeight = alto;
    min_animState.sliderWidth = sWidth;
    min_animState.stepWidth = stepWidth;
    min_animState.minBoundary = minBoundary;
    min_animState.maxBoundary = maxBoundary;
    min_animState.initOffSet = min_initOff;
    min_animState.minBoundaryPosition = minPos;
    min_animState.maxBoundaryPosition = minPos + sWidth;
    
    // Deslizador máximo inicial
    const max_initOff = (max_initVal - ((maxBoundary - minBoundary) / 2)) * stepWidth;
    max_setInitOffset(max_initOff);
    const maxPos = (-sWidth/2) - max_initOff;
    max_setMinBoundaryPosition(maxPos);
    max_setMaxBoundaryPosition(maxPos + sWidth);
    max_animState.sliderHeight = alto;
    max_animState.sliderWidth = sWidth;
    max_animState.stepWidth = stepWidth;
    max_animState.minBoundary = minBoundary;
    max_animState.maxBoundary = maxBoundary;
    max_animState.initOffSet = max_initOff;
    max_animState.minBoundaryPosition = maxPos;
    max_animState.maxBoundaryPosition = maxPos + sWidth;

    // Inicializar los deslizadores
    placeSlider(min_pan.x._value, min_animState, max_animState, max_setMinBoundaryPosition, true);
    placeSlider(min_pan.x._value, max_animState, min_animState, min_setMaxBoundaryPosition, false);
    
  };

  // Función principal, colocar el deslizador, contraerlo y cambiar el límite de solapamiento del otro deslizador.
  const placeSlider = (position, state, otherSliderState, setBoundary, isMin = true ) => {
    
    let newVal = position + state.offSet + state.initOffSet + state.sliderWidth / 2 - state.clampOffSet;

    // Asegúrese de que el valor está limitado en los límites
    newVal = Math.max(state.minBoundaryPosition + state.initOffSet + state.sliderWidth / 2, Math.min(state.maxBoundaryPosition + state.initOffSet + state.sliderWidth / 2, newVal));

    // Limita el otro deslizador para evitar solapamientos
    let newBoundary = 0;
    if(isMin === true){

      // Desbloquear la posición del Deslizador
      state.effectiveMaxBoundaryPosition = state.maxBoundaryPosition;

      // Limitar el mínimo del deslizador máximo
      newBoundary = Math.min( newVal - otherSliderState.initOffSet - state.sliderWidth / 2, otherSliderState.maxBoundaryPosition);
      setBoundary(newBoundary);
      otherSliderState.minBoundaryPosition = newBoundary;

    }else{

      // Desbloquear la posición del deslizador
      state.effectiveMinBoundaryPosition = state.minBoundaryPosition;

      // Limitar el máximo del deslizador máximo
      newBoundary = Math.max(newVal - otherSliderState.initOffSet - state.sliderWidth / 2, otherSliderState.minBoundaryPosition) 
      setBoundary(newBoundary);
      otherSliderState.maxBoundaryPosition = newBoundary;

    }

    // Establecer el valor
    state.displayVal = Math.trunc((newVal + state.stepWidth / 2) / state.stepWidth);
    setForceRender(newVal); // Actualiza el estado para que se llame a la función de renderizado (y se actualicen los elementos en pantalla)
    state.currentVal = newVal - state.initOffSet - state.sliderWidth / 2;
  };

  /* ----------------- Min slider ----------------------- */
  const min_pan = React.useRef(new Animated.ValueXY()).current;
  const [min_initOffset, min_setInitOffset] = React.useState(0);
  const [min_minBoundaryPosition, min_setMinBoundaryPosition] = React.useState(0);
  const [min_maxBoundaryPosition, min_setMaxBoundaryPosition] = React.useState(0);
  const [min_effectiveMaxBoundaryPosition, min_setEffectiveMaxBoundaryPosition] = React.useState(0);
  const min_animState = React.useRef({
    currentVal: 0,
    displayVal:0,
    sliderWidth:0,
    stepWidth:0,
    minBoundary:0,
    maxBoundary:0,
    minBoundaryPosition:0,
    maxBoundaryPosition:0,
    effectiveMaxBoundaryPosition:0,
    offSet: 0,
    clampOffSet: 0,
    initOffSet: 0,
  }).current;


  const min_getPanResponder = () => {

    return PanResponder.create({

      onMoveShouldSetResponderCapture: () => true,     //Dile a iOS que estamos permitiendo el movimiento
      onMoveShouldSetPanResponderCapture: () => true,  // Lo mismo aquí, dile a iOS que permitimos el arrastre
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {  // Cuando el deslizador comienza a moverse

        setIsTouchable(true);
        const clamp = Math.max(min_animState.minBoundaryPosition, Math.min(min_animState.maxBoundaryPosition, min_animState.currentVal));
        min_animState.clampOffSet = min_animState.clampOffSet + min_pan.x._value - clamp;
        min_pan.setOffset({x: clamp, y: 0});

      },
      onPanResponderMove: (e, gesture) => {            // Cuando el deslizador se mueve

        min_setEffectiveMaxBoundaryPosition(min_animState.maxBoundaryPosition);
        placeSlider(min_pan.x._value, min_animState, max_animState, max_setMinBoundaryPosition, true);
        Animated.event([null, { dx: min_pan.x, dy: min_pan.y }], {useNativeDriver: false})(e, {dx:gesture.dx, dy: 0});

      },
      onPanResponderRelease: (e, gesture) => {         // Cuando se suelta el control deslizante

         // Bloquear la posición del slider
        min_animState.effectiveMaxBoundaryPosition = min_animState.currentVal;
        min_setEffectiveMaxBoundaryPosition(min_animState.currentVal);
        
        // Guardar el desplazamiento del deslizador
        min_animState.offSet = min_animState.offSet + min_pan.x._value;
        min_pan.flattenOffset();
        setIsTouchable(false);
      }
    });

  };

  const [min_panResponder] = React.useState(min_getPanResponder());

  const min_getSlider = () => {

    return (
      <Animated.View
        style={[
          styles.draggable,
          { transform: [{ 
              translateX: min_pan.x.interpolate({
                inputRange: [Math.min(min_minBoundaryPosition, min_effectiveMaxBoundaryPosition), Math.max(min_minBoundaryPosition, min_effectiveMaxBoundaryPosition)],
                outputRange: [Math.min(min_minBoundaryPosition, min_effectiveMaxBoundaryPosition), Math.max(min_minBoundaryPosition, min_effectiveMaxBoundaryPosition)],
                extrapolate: 'clamp'
              })
            }]
          },
          { left: sliderCenter + min_initOffset - sliderHeight * manualOffsetBetweenSlider}
        ]}
        {...min_panResponder.panHandlers}
      >
        {isTouchable && 
          <View style={[styles.circle, {bottom: 35}]}>
          </View>
        }

        <View style={styles.circle} />
      </Animated.View>
    );

  };

  const min_getLine = () => {

    return (
      <Animated.View 
        style={[
          styles.line,
          [{
            translateX: min_pan.x.interpolate({
              inputRange: [Math.min(min_minBoundaryPosition, min_effectiveMaxBoundaryPosition), Math.max(min_minBoundaryPosition, min_effectiveMaxBoundaryPosition)],
              outputRange: [
                Math.min(min_minBoundaryPosition + min_initOffset - sliderWidth/2 - sliderHeight*manualOffsetBetweenSlider,
                min_effectiveMaxBoundaryPosition + min_initOffset - sliderWidth/2 - sliderHeight*manualOffsetBetweenSlider), 
                Math.max(min_minBoundaryPosition + min_initOffset - sliderWidth/2 - sliderHeight*manualOffsetBetweenSlider,
                min_effectiveMaxBoundaryPosition + min_initOffset - sliderWidth/2 - sliderHeight*manualOffsetBetweenSlider), ],
              extrapolate: 'clamp'
            })
          }],
          {backgroundColor: colorNeutral}
        ]}
      />
    );
  }

  /* ----------------- Max slider ----------------------- */
  const max_pan = React.useRef(new Animated.ValueXY()).current;
  const [max_initOffset, max_setInitOffset] = React.useState(0);
  const [max_minBoundaryPosition, max_setMinBoundaryPosition] = React.useState(0);
  const [max_maxBoundaryPosition, max_setMaxBoundaryPosition] = React.useState(0);
  const [max_effectiveMinBoundaryPosition, max_setEffectiveMinBoundaryPosition] = React.useState(0);
  const max_animState = React.useRef({
    currentVal: 0,
    displayVal:0,
    sliderWidth:0,
    stepWidth:0,
    minBoundary:0,
    maxBoundary:0,
    minBoundaryPosition:0,
    maxBoundaryPosition:0,
    effectiveMinBoundaryPosition:0,
    offSet: 0,
    clampOffSet: 0,
    initOffSet: 0,
  }).current;

  const max_getPanResponder = () => {

    return PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,        //Dile a iOS que estamos permitiendo el movimiento
      onMoveShouldSetPanResponderCapture: () => true,     // Lo mismo aquí, dile a iOS que permitimos el arrastre
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        const clamp = Math.max(max_animState.minBoundaryPosition, Math.min(max_animState.maxBoundaryPosition, max_animState.currentVal));
        max_animState.clampOffSet = max_animState.clampOffSet + max_pan.x._value - clamp;
        max_pan.setOffset({x: clamp, y: 0});
      },
      onPanResponderMove: (e, gesture) => {
        max_setEffectiveMinBoundaryPosition(max_animState.minBoundaryPosition);
        placeSlider(max_pan.x._value, max_animState, min_animState, min_setMaxBoundaryPosition, false);
        Animated.event([null, {dx: max_pan.x, dy: max_pan.y}], {useNativeDriver: false})(e, {dx: gesture.dx, dy: 0});
      },
      onPanResponderRelease: (evt, gestureState) => {
        max_animState.effectiveMinBoundaryPosition = max_animState.currentVal;
        max_setEffectiveMinBoundaryPosition(max_animState.currentVal);
        max_animState.offSet = max_animState.offSet + max_pan.x._value;
        max_pan.flattenOffset();
      }
    })
  };

  const [max_panResponder, max_setPanResponder] = React.useState(max_getPanResponder());

  const max_getSlider = () => {

    return (
      <Animated.View
        style={[
          styles.draggable,
          { transform:
            [{ translateX: max_pan.x.interpolate({
                inputRange: [Math.min(max_effectiveMinBoundaryPosition, max_maxBoundaryPosition), Math.max(max_effectiveMinBoundaryPosition, max_maxBoundaryPosition)],
                outputRange: [Math.min(max_effectiveMinBoundaryPosition, max_maxBoundaryPosition), Math.max(max_effectiveMinBoundaryPosition, max_maxBoundaryPosition)],
                extrapolate: 'clamp'
              })
            }]
          },
          {left:sliderCenter + max_initOffset + sliderHeight*manualOffsetBetweenSlider}
        ]}
        {...max_panResponder.panHandlers}
      >
         {isTouchable && 
          <View style={[styles.circle, {bottom: 35}]}>
          </View>
        }
       <View style={styles.circle} />
      </Animated.View>
    );
  };

  const max_getLine = () => {

    return(
      <Animated.View style={[
        styles.line,
        [{ translateX: max_pan.x.interpolate({
            inputRange: [Math.min(max_effectiveMinBoundaryPosition, max_maxBoundaryPosition), Math.max(max_effectiveMinBoundaryPosition, max_maxBoundaryPosition)],
            outputRange: [
              Math.min(max_effectiveMinBoundaryPosition + sliderWidth/2 + max_initOffset + sliderHeight*manualOffsetBetweenSlider,
              max_maxBoundaryPosition + sliderWidth/2 + max_initOffset + sliderHeight*manualOffsetBetweenSlider),
              Math.max(max_effectiveMinBoundaryPosition + sliderWidth/2 + max_initOffset + sliderHeight*manualOffsetBetweenSlider,
              max_maxBoundaryPosition + sliderWidth/2 + max_initOffset + sliderHeight*manualOffsetBetweenSlider),],
            extrapolate: 'clamp'
          })
        }],
        {backgroundColor:colorNeutral}
        ]}
      />
    );
  };

  /* ---------------------- Render ------------------------- */

  return(
    <View style={styles.root}>
      <View style={styles.container}>
        <View 
          style={[styles.sliderContainer, {backgroundColor: 'white', marginHorizontal: sliderHeight * manualOffsetBetweenSlider }]}
          onLayout={(event) => initSliders(event.nativeEvent.layout.height, event.nativeEvent.layout.width) }
        >
          <View style={[styles.lineContainer, {backgroundColor: colorHighlight}]}>
            {min_getLine()}
            {max_getLine()}
          </View>
            {min_getSlider()}
            {max_getSlider()}
        </View>
      </View>
      <View style={{marginHorizontal: sliderHeight * manualOffsetBetweenSlider, backgroundColor: 'white', flexDirection: 'row', width: '100%', paddingHorizontal: 20, justifyContent: 'space-between'}}>
        <Text>{`${min_animState.displayVal}%`}</Text>
        <Text>{`${max_animState.displayVal}%`}</Text>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  root:{
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%',
    aspectRatio: 4
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flex: 1,
    flexDirection: 'row'
  },
  labelValue: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flex: 1,
  },
  labelValueText: {
    fontSize: 11,
  },
  sliderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    height: '100%',
    flex: 8,
    overflow: 'visible'
  },
  lineContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    height: 4,
    width: '80%',
    flexDirection: 'row',
    position: 'absolute',
    left: '10%',
    top: '50%',
    marginTop: -3,
    borderRadius: 60,
  },
  line: {
    height:"100%",
    width:"100%",
    position:'absolute',
  },
  draggable: {
    alignItems: "center",
    justifyContent: "center",
    height:"100%",
    aspectRatio:1,
    position:'absolute',
    flexDirection:'row',
    borderRadius:100,
    overflow: "visible",
  },
  circle:{
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.24,
    shadowRadius: 2.8,
    elevation: 3,
    overflow: "visible",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    aspectRatio: 1,
    borderRadius: '50%',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "blue",
    overflow: "visible",
    width: 20,
  },
  labelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%',
    aspectRatio: 3,
    position: 'absolute',
    bottom: 0
  },
  label: {
    fontSize: 9,
  }
})
