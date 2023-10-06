import { Mesh, Color, BackSide, SphereGeometry, ShaderMaterial } from "three";
export class Sky extends Mesh {
  constructor(hemiLight, scene) {
    super();
    this.vertexShader = `
      varying vec3 vWorldPosition;

			void main() {

				vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
				vWorldPosition = worldPosition.xyz;

				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			}`;

    this.fragmentShader = `
        uniform vec3 topColor;
              uniform vec3 bottomColor;
              uniform float offset;
              uniform float exponent;
  
              varying vec3 vWorldPosition;
  
              void main() {
  
                  float h = normalize( vWorldPosition + offset ).y;
                  gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );
  
              }`;
    this.uniforms = {
      topColor: { value: new Color(0x0077ff) },
      bottomColor: { value: new Color(0xffffff) },
      offset: { value: 33 },
      exponent: { value: 0.6 },
    };
    this.uniforms["topColor"].value.copy(hemiLight.color);
    scene.fog.color.copy(this.uniforms["bottomColor"].value);
    this.geometry = new SphereGeometry(4000, 32, 15);
    this.material = new ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      side: BackSide,
    });
  }
}
