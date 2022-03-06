var scene,camera,renderer;
scene=new THREE.Scene();
    scene.background=new THREE.Color(xff50f)
camera =new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight);
camera.position.set(0,100,1000);

renderer=new THREE.WebGLRendere();
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);
function animate(){
requestAnimationFrame(animate);
    renderer.render(scene,camera);
}