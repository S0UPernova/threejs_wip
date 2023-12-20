uniform float time;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.141592653589793238;

// //
// // GLSL textureless classic 3D noise "cnoise",
// // with an RSL-style periodic variant "pnoise".
// // Author:  Stefan Gustavson (stefan.gustavson@liu.se)
// // Version: 2011-10-11
// //
// // Many thanks to Ian McEwan of Ashima Arts for the
// // ideas for permutation and gradient selection.
// //
// // Copyright (c) 2011 Stefan Gustavson. All rights reserved.
// // Distributed under the MIT license. See LICENSE file.
// // https://github.com/stegu/webgl-noise
// //

// vec3 mod289(vec3 x)
// {
//   return x - floor(x * (1.0 / 289.0)) * 289.0;
// }

// vec4 mod289(vec4 x)
// {
//   return x - floor(x * (1.0 / 289.0)) * 289.0;
// }

// vec4 permute(vec4 x)
// {
//   return mod289(((x*34.0)+10.0)*x);
// }

// vec4 taylorInvSqrt(vec4 r)
// {
//   return 1.79284291400159 - 0.85373472095314 * r;
// }

// vec3 fade(vec3 t) {
//   return t*t*t*(t*(t*6.0-15.0)+10.0);
// }

// // Classic Perlin noise
// float cnoise(vec3 P)
// {
//   vec3 Pi0 = floor(P); // Integer part for indexing
//   vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
//   Pi0 = mod289(Pi0);
//   Pi1 = mod289(Pi1);
//   vec3 Pf0 = fract(P); // Fractional part for interpolation
//   vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
//   vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
//   vec4 iy = vec4(Pi0.yy, Pi1.yy);
//   vec4 iz0 = Pi0.zzzz;
//   vec4 iz1 = Pi1.zzzz;

//   vec4 ixy = permute(permute(ix) + iy);
//   vec4 ixy0 = permute(ixy + iz0);
//   vec4 ixy1 = permute(ixy + iz1);

//   vec4 gx0 = ixy0 * (1.0 / 7.0);
//   vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
//   gx0 = fract(gx0);
//   vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
//   vec4 sz0 = step(gz0, vec4(0.0));
//   gx0 -= sz0 * (step(0.0, gx0) - 0.5);
//   gy0 -= sz0 * (step(0.0, gy0) - 0.5);

//   vec4 gx1 = ixy1 * (1.0 / 7.0);
//   vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
//   gx1 = fract(gx1);
//   vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
//   vec4 sz1 = step(gz1, vec4(0.0));
//   gx1 -= sz1 * (step(0.0, gx1) - 0.5);
//   gy1 -= sz1 * (step(0.0, gy1) - 0.5);

//   vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
//   vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
//   vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
//   vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
//   vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
//   vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
//   vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
//   vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

//   vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
//   g000 *= norm0.x;
//   g010 *= norm0.y;
//   g100 *= norm0.z;
//   g110 *= norm0.w;
//   vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
//   g001 *= norm1.x;
//   g011 *= norm1.y;
//   g101 *= norm1.z;
//   g111 *= norm1.w;

//   float n000 = dot(g000, Pf0);
//   float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
//   float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
//   float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
//   float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
//   float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
//   float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
//   float n111 = dot(g111, Pf1);

//   vec3 fade_xyz = fade(Pf0);
//   vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
//   vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
//   float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
//   return 2.2 * n_xyz;
// }

// // Classic Perlin noise, periodic variant
// float pnoise(vec3 P, vec3 rep)
// {
//   vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
//   vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
//   Pi0 = mod289(Pi0);
//   Pi1 = mod289(Pi1);
//   vec3 Pf0 = fract(P); // Fractional part for interpolation
//   vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
//   vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
//   vec4 iy = vec4(Pi0.yy, Pi1.yy);
//   vec4 iz0 = Pi0.zzzz;
//   vec4 iz1 = Pi1.zzzz;

//   vec4 ixy = permute(permute(ix) + iy);
//   vec4 ixy0 = permute(ixy + iz0);
//   vec4 ixy1 = permute(ixy + iz1);

//   vec4 gx0 = ixy0 * (1.0 / 7.0);
//   vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
//   gx0 = fract(gx0);
//   vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
//   vec4 sz0 = step(gz0, vec4(0.0));
//   gx0 -= sz0 * (step(0.0, gx0) - 0.5);
//   gy0 -= sz0 * (step(0.0, gy0) - 0.5);

//   vec4 gx1 = ixy1 * (1.0 / 7.0);
//   vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
//   gx1 = fract(gx1);
//   vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
//   vec4 sz1 = step(gz1, vec4(0.0));
//   gx1 -= sz1 * (step(0.0, gx1) - 0.5);
//   gy1 -= sz1 * (step(0.0, gy1) - 0.5);

//   vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
//   vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
//   vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
//   vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
//   vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
//   vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
//   vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
//   vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

//   vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
//   g000 *= norm0.x;
//   g010 *= norm0.y;
//   g100 *= norm0.z;
//   g110 *= norm0.w;
//   vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
//   g001 *= norm1.x;
//   g011 *= norm1.y;
//   g101 *= norm1.z;
//   g111 *= norm1.w;

//   float n000 = dot(g000, Pf0);
//   float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
//   float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
//   float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
//   float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
//   float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
//   float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
//   float n111 = dot(g111, Pf1);

//   vec3 fade_xyz = fade(Pf0);
//   vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
//   vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
//   float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
//   return 2.2 * n_xyz;
// }


// mat3 rotation3dY(float angle) {
//   float s = sin(angle);
//   float c = cos(angle);

//   return mat3(
//     c, 0.0, -s,
//     0.0, 1.0, 0.0,
//     s, 0.0, c
//   );
// }

// float saturate(float x)
// {
//   return clamp(x, 0.0, 1.0);
// }

// vec3 curl_noise(vec3 p)
// {

//   // return curlNoise(p);
//   const float step = 0.01;
//   float ddx = cnoise(p+vec3(step, 0.0, 0.0)) - cnoise(p-vec3(step, 0.0, 0.0));
//   float ddy = cnoise(p+vec3(0.0, step, 0.0)) - cnoise(p-vec3(0.0, step, 0.0));
//   float ddz = cnoise(p+vec3(0.0, 0.0, step)) - cnoise(p-vec3(0.0, 0.0, step));

//   const float divisor = 1.0 / ( 2.0 * step );
//   return ( vec3(ddy - ddz, ddz - ddx, ddx - ddy) * divisor );
// }

// vec3 fbm_vec3(vec3 p, float frequency, float offset)
// {
//   return vec3(
//     cnoise((p+vec3(offset))*frequency),
//     cnoise((p+vec3(offset+20.0))*frequency),
//     cnoise((p+vec3(offset-30.0))*frequency)
//   );
// }






//
// Description : Array and textureless GLSL 2D/3D/4D simplex
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//

vec4 mod289(vec4 x) {
return x - floor(x * (1.0 / 289.0)) * 289.0;
}

float mod289(float x) {
return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
return mod289(((x*34.0)+1.0)*x);
}

float permute(float x) {
return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
return 1.79284291400159 - 0.85373472095314 * r;
}

float taylorInvSqrt(float r)
{
return 1.79284291400159 - 0.85373472095314 * r;
}

vec4 grad4(float j, vec4 ip)
{
const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
vec4 p,s;

p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
s = vec4(lessThan(p, vec4(0.0)));
p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;

return p;
}

// (sqrt(5) - 1)/4 = F4, used once below
#define F4 0.309016994374947451

float snoise(vec4 v)
{
const vec4  C = vec4( 0.138196601125011,  // (5 - sqrt(5))/20  G4
0.276393202250021,  // 2 * G4
0.414589803375032,  // 3 * G4
-0.447213595499958); // -1 + 4 * G4

// First corner
vec4 i  = floor(v + dot(v, vec4(F4)) );
vec4 x0 = v -   i + dot(i, C.xxxx);

// Other corners

// Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
vec4 i0;
vec3 isX = step( x0.yzw, x0.xxx );
vec3 isYZ = step( x0.zww, x0.yyz );
//  i0.x = dot( isX, vec3( 1.0 ) );
i0.x = isX.x + isX.y + isX.z;
i0.yzw = 1.0 - isX;
//  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
i0.y += isYZ.x + isYZ.y;
i0.zw += 1.0 - isYZ.xy;
i0.z += isYZ.z;
i0.w += 1.0 - isYZ.z;

// i0 now contains the unique values 0,1,2,3 in each channel
vec4 i3 = clamp( i0, 0.0, 1.0 );
vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

//  x0 = x0 - 0.0 + 0.0 * C.xxxx
//  x1 = x0 - i1  + 1.0 * C.xxxx
//  x2 = x0 - i2  + 2.0 * C.xxxx
//  x3 = x0 - i3  + 3.0 * C.xxxx
//  x4 = x0 - 1.0 + 4.0 * C.xxxx
vec4 x1 = x0 - i1 + C.xxxx;
vec4 x2 = x0 - i2 + C.yyyy;
vec4 x3 = x0 - i3 + C.zzzz;
vec4 x4 = x0 + C.wwww;

// Permutations
i = mod289(i);
float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
vec4 j1 = permute( permute( permute( permute (
i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
+ i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
+ i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
+ i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

// Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope
// 7*7*6 = 294, which is close to the ring size 17*17 = 289.
vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

vec4 p0 = grad4(j0,   ip);
vec4 p1 = grad4(j1.x, ip);
vec4 p2 = grad4(j1.y, ip);
vec4 p3 = grad4(j1.z, ip);
vec4 p4 = grad4(j1.w, ip);

// Normalise gradients
vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
p0 *= norm.x;
p1 *= norm.y;
p2 *= norm.z;
p3 *= norm.w;
p4 *= taylorInvSqrt(dot(p4,p4));

// Mix contributions from the five corners
vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
m0 = m0 * m0;
m1 = m1 * m1;
return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
+ dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

}



float fbm(vec4 p) {
  float sum = 0.7;
  float amp = 1.;
  float scale = 10.;
  for (int i=0; i<6;i++) {
    sum += snoise(p*scale)*amp;
    p.w += 10.;
    amp *=0.7;
    scale *=1.69;
  }
  return sum;
}

/* 
* SMOOTH MOD
* - authored by @charstiles -
* based on https://math.stackexchange.com/questions/2491494/does-there-exist-a-smooth-approximation-of-x-bmod-y
* (axis) input axis to modify
* (amp) amplitude of each edge/tip
* (rad) radius of each edge/tip
* returns => smooth edges
*/

float smoothMod(float axis, float amp, float rad) {
    float top = cos(PI * (axis / amp)) * sin(PI * (axis / amp));
    float bottom = pow(sin(PI * (axis / amp)), 2.0) + pow(rad, 2.0);
    float at = atan(top / bottom);
    return amp * (1.0 / 2.0) - (1.0 / PI) * at;
}

float fit(float unscaled, float originalMin, float originalMax, float minAllowed, float maxAllowed) {
  return (maxAllowed - minAllowed) + (unscaled - originalMin) / (originalMax - originalMin) + minAllowed;
}

// someone else 
float wave(vec2 position) {
  return fit(smoothMod(vPosition.y * 15.0, 1.0, 1.5), 0.35, 0.6, 0.0, 1.0);
}

void main() {
  // vec2 uv = vUv;
  // uv.y += time;
  // // float noisy = cnoise(vPosition);
  // float pattern = wave(uv);
  // gl_FragColor = vec4(vec3(pattern), 1.);




  vec4 p = vec4(vPosition*3.,time*0.05);
  float noisy = fbm(p);
  vec4 p1 = vec4(vPosition*2.,time);
  float spots = max(snoise(p1), 0.);
  gl_FragColor = vec4(vec3(noisy + .4  + .1, (noisy * 0.7)  + .2, (noisy * 0.6)  + .2) - (spots * .5), 1.0);

}
