(()=>{"use strict";(()=>{function e(t){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},e(t)}var t=function e(t){return t.root&&t.root!==t?e(t.root):t};function o(t,o,n){var r=function(t){return"symbol"===e(t)||"number"==typeof t?t:String(t)},i=null==t?void 0:function(e,t){var o;o=t;for(var n=0,i=(t=Array.isArray(o)?o:o.split(".").filter(Boolean)).length;null!=e&&n<i;)e=e[r(t[n++])];return n&&n===i?e:void 0}(t,o);return void 0===i?n:i}function n(e){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},n(e)}function r(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),o.push.apply(o,n)}return o}function i(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?r(Object(o),!0).forEach((function(t){p(e,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):r(Object(o)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))}))}return e}function a(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,f(n.key),n)}}function l(e,t,o){return t=u(t),function(e,t){if(t&&("object"==n(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}(e,c()?Reflect.construct(t,o||[],u(e).constructor):t.apply(e,o))}function c(){try{var e=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(e){}return(c=function(){return!!e})()}function u(e){return u=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},u(e)}function s(e,t){return s=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},s(e,t)}function p(e,t,o){return(t=f(t))in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}function f(e){var t=function(e,t){if("object"!=n(e)||!e)return e;var o=e[Symbol.toPrimitive];if(void 0!==o){var r=o.call(e,"string");if("object"!=n(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==n(t)?t:t+""}var y=function(e){function t(){var e;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var o=arguments.length,n=new Array(o),r=0;r<o;r++)n[r]=arguments[r];return p(e=l(this,t,[].concat(n)),"formatAddress",(function(e){var t="",o="",n="",r="",a="",l="",c=e.geometry?{lat:e.geometry.location.lat(),lng:e.geometry.location.lng()}:null;return e.address_components&&e.address_components.forEach((function(e){var i=e.types;i.includes("country")&&(t=e.long_name),i.includes("postal_code")&&(o=e.long_name),i.includes("administrative_area_level_1")&&(n=e.long_name),i.includes("locality")&&(r=e.long_name),i.includes("route")&&(a=e.long_name),i.includes("street_number")&&(l=e.long_name)})),i(i({},e),{},{zip:o,city:r,state:n,street:a,country:t,location:c,streetNumber:l,formattedPlace:e.formattedPlace})})),e}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&s(e,t)}(t,Formio.Providers.providers.address.google),n=t,c=[{key:"name",get:function(){return"google"}},{key:"displayName",get:function(){return"Google Maps"}},{key:"initialize",value:function(){var e=Formio.Components.components.address.editForm;Formio.Components.components.address.editForm=function(){var t=e.apply(void 0,arguments),o=t.components.find((function(e){return"tabs"===e.type})).components.find((function(e){return"provider"===e.key}));return o.components.push({type:"checkbox",input:!0,inputType:"checkbox",key:"providerOptions.params.isMapEnabled",label:"Show Map",defaultValue:!1,conditional:{json:{"===":[{var:"data.provider"},"google"]}}}),o.components.push({type:"number",input:!0,key:"providerOptions.params.defaultZoom",label:"Zoom",defaultValue:8,conditional:{json:{"===":[{var:"data.provider"},"google"]}}}),o.components.push({type:"number",input:!0,key:"providerOptions.params.defaultCenterLat",label:"Default Center Latitude",defaultValue:40.712776,conditional:{json:{"===":[{var:"data.provider"},"google"]}}}),o.components.push({type:"number",input:!0,key:"providerOptions.params.defaultCenterLng",label:"Default Center Longitude",defaultValue:-74.0059728,conditional:{json:{"===":[{var:"data.provider"},"google"]}}}),t}}}],(r=[{key:"updateMap",value:function(e){var t=e.lat,o=e.lng;this.marker.setPosition({lat:t,lng:o}),this.map.setCenter(this.marker.position)}},{key:"reverseGeocode",value:function(e,t){var n=this;(new google.maps.Geocoder).geocode({location:{lat:e,lng:t}},(function(r,i){var a=r[0];if("OK"===i&&a){var l=!0,c=n.options.params.autocompleteOptions;if(c.componentRestrictions&&c.componentRestrictions.country){var u=a.address_components.find((function(e){return-1!==e.types.indexOf("country")}));u?u.short_name.toLowerCase()!==c.componentRestrictions.country.toLowerCase()&&(l=!1):l=!1}if(!l)return;n.element&&(a.formattedPlace=o(n.autocomplete,"gm_accessors_.place.se.formattedPrediction",a[n.alternativeDisplayValueProperty]),n.onSelectAddress(n.formatAddress(a),n.element),n.updateMap({lat:e,lng:t}))}else console.error("Geocoder failed due to:",i)}))}},{key:"initMap",value:function(e,t,o){var n=this;if(this.map=new google.maps.Map(e,{zoom:t,center:this.currentValue||o}),this.marker=new google.maps.Marker({position:this.currentValue||o,map:this.map,draggable:!0}),this.element.disabled||(google.maps.event.addListener(this.marker,"dragend",(function(e){var t=e.latLng.lat(),o=e.latLng.lng();n.reverseGeocode(t,o)})),google.maps.event.addListener(this.map,"click",(function(e){var t=e.latLng.lat(),o=e.latLng.lng();n.reverseGeocode(t,o)}))),this.element.value){var r={query:this.element.value,fields:["name","geometry"]};new google.maps.places.PlacesService(this.map).findPlaceFromQuery(r,(function(e,t){t===google.maps.places.PlacesServiceStatus.OK&&(n.map.setCenter(e[0].geometry.location),n.marker.setPosition(e[0].geometry.location))}))}}},{key:"attachAutocomplete",value:function(e,t,n){var r=this;this.onSelectAddress=n,this.element=e;var i=this.options.params,a=i.defaultCenterLat,l=i.defaultCenterLng,c=i.isMapEnabled,u=i.defaultZoom,s=document.createElement("div");s.style.height="400px",s.style["margin-top"]="16px",s.style.width="100%",s.style.background="#eee",c&&e.parentNode.parentNode.insertBefore(s,e.nextSibling),Formio.libraryReady(this.getLibraryName()).then((function(){var i=new google.maps.places.Autocomplete(e,r.autocompleteOptions);i.addListener("place_changed",(function(){var a=r.filterPlace(i.getPlace()),l=a.geometry?{lat:a.geometry.location.lat(),lng:a.geometry.location.lng()}:null;c&&r.updateMap(l),a.formattedPlace=o(i,"gm_accessors_.place.se.formattedPrediction",a[r.alternativeDisplayValueProperty]),n(r.formatAddress(a),e,t)})),c&&r.initMap(s,u,{lat:a,lng:l})}))}}])&&a(n.prototype,r),c&&a(n,c),Object.defineProperty(n,"prototype",{writable:!1}),n;var n,r,c}();function d(e){return d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},d(e)}function m(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,v(n.key),n)}}function v(e){var t=function(e,t){if("object"!=d(e)||!e)return e;var o=e[Symbol.toPrimitive];if(void 0!==o){var n=o.call(e,"string");if("object"!=d(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==d(t)?t:t+""}function b(e,t,o){return t=O(t),function(e,t){if(t&&("object"==d(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}(e,g()?Reflect.construct(t,o||[],O(e).constructor):t.apply(e,o))}function g(){try{var e=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(e){}return(g=function(){return!!e})()}function h(){return h="undefined"!=typeof Reflect&&Reflect.get?Reflect.get.bind():function(e,t,o){var n=function(e,t){for(;!{}.hasOwnProperty.call(e,t)&&null!==(e=O(e)););return e}(e,t);if(n){var r=Object.getOwnPropertyDescriptor(n,t);return r.get?r.get.call(arguments.length<3?e:o):r.value}},h.apply(null,arguments)}function O(e){return O=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},O(e)}function w(e,t){return w=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},w(e,t)}var P=function(e){function o(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,o),b(this,o,arguments)}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&w(e,t)}(o,Formio.Components.components.select),n=o,i=[{key:"schema",value:function(){for(var e,t=arguments.length,o=new Array(t),n=0;n<t;n++)o[n]=arguments[n];return(e=Formio.Components.components.select).schema.apply(e,[{type:"utilityproviderselect",label:"Utility provider select",key:"utilityproviderselect",dataSrc:"url",valueProperty:"",selectValues:"outputs.utility_info",template:"<span>{{ item.utility_name }}</span>",data:{url:""}}].concat(o))}},{key:"builderInfo",get:function(){return{title:"Utility provider select",group:"advanced",icon:"fa fa-list",weight:70,schema:o.schema()}}},{key:"editForm",value:function(){for(var e,t=arguments.length,o=new Array(t),n=0;n<t;n++)o[n]=arguments[n];return(e=Formio.Components.components.select).editForm.apply(e,[[{key:"data",components:[{type:"textfield",input:!0,label:"API Key",key:"api_key",weight:20,placeholder:"Enter your API key",tooltip:"The API key for the data source"}]},{key:"data",components:[{type:"textfield",input:!0,label:"Radius",key:"radius",weight:20,placeholder:"Enter search radius from 0 to 200"}]}]].concat(o))}}],(r=[{key:"loadItems",value:function(e,n,r,i,a){var l,c,u=t(this).getComponent("address");if(!u)return[];var s=u.getValue(),p=(null==s||null===(l=s.data)||void 0===l||null===(l=l.address)||void 0===l||null===(l=l.geometry)||void 0===l?void 0:l.location)||(null==s||null===(c=s.geometry)||void 0===c?void 0:c.location);if(p){var f=p.lat,y=p.lng;f="function"==typeof f?f():f,y="function"==typeof y?y():y;var d=this.component.api_key,m=this.component.radius||0;return f&&y&&(e="https://developer.nrel.gov/api/utility_rates/v3.json?api_key=".concat(d,"&lat=").concat(f,"&lon=").concat(y,"&radius=").concat(m)),h(O(o.prototype),"loadItems",this).call(this,e,n,r,i,a)}}}])&&m(n.prototype,r),i&&m(n,i),Object.defineProperty(n,"prototype",{writable:!1}),n;var n,r,i}();console.info("Custom components was loaded."),y.initialize(),Formio.Providers.addProvider("address","google",y),Formio.Components.addComponent("utilityproviderselect",P)})()})();
//# sourceMappingURL=formio.js.map