/* Spherical route geometry, shared by the renderer and unit checks. */
(function(root){
  const D=Math.PI/180;
  const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
  const norm=v=>{const n=Math.hypot(...v)||1;return v.map(x=>x/n)};
  const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
  const vector=(lat,lon)=>[Math.cos(lat*D)*Math.sin(lon*D),Math.sin(lat*D),Math.cos(lat*D)*Math.cos(lon*D)];
  const latlon=v=>{v=norm(v);return[Math.asin(clamp(v[1],-1,1))/D,Math.atan2(v[0],v[2])/D]};
  function interpolate(a,b,t){const angle=Math.acos(clamp(dot(a,b),-1,1));if(angle<1e-7)return a.slice();if(Math.PI-angle<1e-5){let p=norm([a[1],-a[0],0]);if(Math.hypot(a[0],a[1])<1e-6)p=[1,0,0];return norm(a.map((v,i)=>v*Math.cos(Math.PI*t)+p[i]*Math.sin(Math.PI*t)))}const d=Math.sin(angle);return a.map((v,i)=>(v*Math.sin((1-t)*angle)+b[i]*Math.sin(t*angle))/d)}
  function rotate(v,lat,lon){const a=lat*D,b=lon*D,x=Math.cos(b)*v[0]-Math.sin(b)*v[2],z=Math.sin(b)*v[0]+Math.cos(b)*v[2];return[x,Math.cos(a)*v[1]-Math.sin(a)*z,Math.sin(a)*v[1]+Math.cos(a)*z]}
  function project(v,lat,lon,cx,cy,r){const q=rotate(v,lat,lon);return{x:cx+q[0]*r,y:cy-q[1]*r,z:q[2],visible:q[2]>=0||q[0]*q[0]+q[1]*q[1]>1.002}}
  const distance=(a,b)=>Math.acos(clamp(dot(vector(...a),vector(...b)),-1,1))*6371;
  const center=(a,b)=>latlon(interpolate(vector(...a),vector(...b),.5));
  const api={D,clamp,norm,dot,vector,latlon,interpolate,rotate,project,distance,center};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.RoyalGlobeMath=api;
})(typeof window==='undefined'?globalThis:window);
