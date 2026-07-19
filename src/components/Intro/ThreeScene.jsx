import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sparkles, Stars } from "@react-three/drei";

import { EffectComposer, Bloom } from "@react-three/postprocessing";


export default function ThreeScene(){

    return(

<Canvas camera={{ position:[0,0,8], fov:45 }}
>

<color attach="background" args={["black"]}/>

<ambientLight intensity={1}/>

<pointLight position={[0,0,3]} intensity={10} color="#67d7ff" />

<Stars radius={10} depth={50} count={5000} factor={6} fade />

<Sparkles count={350} size={2} speed={0.4} scale={20} />



<EffectComposer>

<Bloom intensity={1.5} mipmapBlur />

</EffectComposer>

</Canvas>

    )

}