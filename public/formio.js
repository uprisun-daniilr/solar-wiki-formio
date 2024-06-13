(()=>{"use strict";(()=>{function e(t){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},e(t)}function t(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,o(r.key),r)}}function o(t){var o=function(t,o){if("object"!=e(t)||!t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var r=n.call(t,"string");if("object"!=e(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t);return"symbol"==e(o)?o:o+""}function n(t,o,n){return o=i(o),function(t,o){if(o&&("object"==e(o)||"function"==typeof o))return o;if(void 0!==o)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(t)}(t,r()?Reflect.construct(o,n||[],i(t).constructor):o.apply(t,n))}function r(){try{var e=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(e){}return(r=function(){return!!e})()}function i(e){return i=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},i(e)}function a(e,t){return a=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},a(e,t)}var l=function(e){function o(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,o);for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];return n(this,o,[].concat(t))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&a(e,t)}(o,Formio.Providers.providers.address.google),r=o,l=[{key:"name",get:function(){return"google"}},{key:"displayName",get:function(){return"Google Maps"}},{key:"initialize",value:function(){var e=Formio.Components.components.address.editForm;Formio.Components.components.address.editForm=function(){var t=e.apply(void 0,arguments),o=t.components.find((function(e){return"tabs"===e.type})).components.find((function(e){return"provider"===e.key}));return o.components.push({type:"checkbox",input:!0,inputType:"checkbox",key:"providerOptions.params.isMapEnabled",label:"Show Map",defaultValue:!1,conditional:{json:{"===":[{var:"data.provider"},"google"]}}}),o.components.push({type:"number",input:!0,key:"providerOptions.params.defaultZoom",label:"Zoom",defaultValue:8,conditional:{json:{"===":[{var:"data.provider"},"google"]}}}),o.components.push({type:"number",input:!0,key:"providerOptions.params.defaultCenterLat",label:"Default Center Latitude",defaultValue:40.712776,conditional:{json:{"===":[{var:"data.provider"},"google"]}}}),o.components.push({type:"number",input:!0,key:"providerOptions.params.defaultCenterLng",label:"Default Center Longitude",defaultValue:-74.0059728,conditional:{json:{"===":[{var:"data.provider"},"google"]}}}),t}}}],(i=[{key:"updateMap",value:function(e){var t=e.lat,o=e.lng;this.marker.setPosition({lat:t,lng:o}),this.map.setCenter(this.marker.position)}},{key:"reverseGeocode",value:function(e,t){var o=this;(new google.maps.Geocoder).geocode({location:{lat:e,lng:t}},(function(n,r){var i=n[0];if("OK"===r&&i){var a=!0,l=o.options.params.autocompleteOptions;if(l.componentRestrictions&&l.componentRestrictions.country){var c=i.address_components.find((function(e){return-1!==e.types.indexOf("country")}));c?c.short_name.toLowerCase()!==l.componentRestrictions.country.toLowerCase()&&(a=!1):a=!1}if(!a)return;o.element&&(o.onSelectAddress(i,o.element),o.updateMap({lat:e,lng:t}))}else console.error("Geocoder failed due to:",r)}))}},{key:"initMap",value:function(e,t,o){var n=this;if(this.map=new google.maps.Map(e,{zoom:t,center:this.currentValue||o}),this.marker=new google.maps.Marker({position:this.currentValue||o,map:this.map,draggable:!0}),this.element.disabled||(google.maps.event.addListener(this.marker,"dragend",(function(e){var t=e.latLng.lat(),o=e.latLng.lng();n.reverseGeocode(t,o)})),google.maps.event.addListener(this.map,"click",(function(e){var t=e.latLng.lat(),o=e.latLng.lng();n.reverseGeocode(t,o)}))),this.element.value){var r={query:this.element.value,fields:["name","geometry"]};new google.maps.places.PlacesService(this.map).findPlaceFromQuery(r,(function(e,t){t===google.maps.places.PlacesServiceStatus.OK&&(n.map.setCenter(e[0].geometry.location),n.marker.setPosition(e[0].geometry.location))}))}}},{key:"attachAutocomplete",value:function(e,t,o){var n=this;this.onSelectAddress=o,this.element=e;var r=this.options.params,i=r.defaultCenterLat,a=r.defaultCenterLng,l=r.isMapEnabled,c=r.defaultZoom,u=document.createElement("div");u.style.height="400px",u.style["margin-top"]="16px",u.style.width="100%",u.style.background="#eee",l&&e.parentNode.insertBefore(u,e.nextSibling),Formio.libraryReady(this.getLibraryName()).then((function(){var r=new google.maps.places.Autocomplete(e,n.autocompleteOptions);r.addListener("place_changed",(function(){var i=n.filterPlace(r.getPlace()),a=i.geometry?{lat:i.geometry.location.lat(),lng:i.geometry.location.lng()}:null;l&&n.updateMap(a),i.formattedPlace=_.get(r,"gm_accessors_.place.se.formattedPrediction",i[n.alternativeDisplayValueProperty]),o(i,e,t)})),l&&n.initMap(u,c,{lat:i,lng:a})}))}}])&&t(r.prototype,i),l&&t(r,l),Object.defineProperty(r,"prototype",{writable:!1}),r;var r,i,l}();function c(e){return c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},c(e)}function u(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,p(n.key),n)}}function p(e){var t=function(e,t){if("object"!=c(e)||!e)return e;var o=e[Symbol.toPrimitive];if(void 0!==o){var n=o.call(e,"string");if("object"!=c(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==c(t)?t:t+""}function s(e,t,o){return t=d(t),function(e,t){if(t&&("object"==c(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}(e,f()?Reflect.construct(t,o||[],d(e).constructor):t.apply(e,o))}function f(){try{var e=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(e){}return(f=function(){return!!e})()}function y(){return y="undefined"!=typeof Reflect&&Reflect.get?Reflect.get.bind():function(e,t,o){var n=function(e,t){for(;!{}.hasOwnProperty.call(e,t)&&null!==(e=d(e)););return e}(e,t);if(n){var r=Object.getOwnPropertyDescriptor(n,t);return r.get?r.get.call(arguments.length<3?e:o):r.value}},y.apply(null,arguments)}function d(e){return d=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},d(e)}function m(e,t){return m=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},m(e,t)}var v=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),s(this,t,arguments)}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&m(e,t)}(t,Formio.Components.components.select),o=t,n=[{key:"loadItems",value:function(e,o,n,r,i){var a=this.root;console.log(a);var l=a.getComponent("latitude").getValue(),c=a.getComponent("longitude").getValue(),u=this.component.api_key;return l&&c&&(e="https://developer.nrel.gov/api/utility_rates/v3.json?api_key=".concat(u,"&lat=").concat(l,"&lon=").concat(c)),y(d(t.prototype),"loadItems",this).call(this,e,o,n,r,i)}}],r=[{key:"schema",value:function(){for(var e,t=arguments.length,o=new Array(t),n=0;n<t;n++)o[n]=arguments[n];return(e=Formio.Components.components.select).schema.apply(e,[{type:"utilityProviderSelect",label:"Utility provider select",key:"utilityProviderSelect",dataSrc:"url",valueProperty:"value",template:"<span>{{ item.label }}</span>",data:{url:""}}].concat(o))}},{key:"builderInfo",get:function(){return{title:"Utility provider select",group:"advanced",icon:"fa fa-list",weight:70,schema:t.schema()}}},{key:"editForm",value:function(e){function t(){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}((function(){for(var e=arguments.length,t=new Array(e),o=0;o<e;o++)t[o]=arguments[o];return editForm.apply(void 0,[[{key:"data",components:[{type:"textfield",input:!0,label:"API Key",key:"api_key",weight:20,placeholder:"Enter your API key",tooltip:"The API key for the data source"}]},{key:"display",components:SelectComponent.editForm().components.find((function(e){return"display"===e.key})).components}]].concat(t))}))}],n&&u(o.prototype,n),r&&u(o,r),Object.defineProperty(o,"prototype",{writable:!1}),o;var o,n,r}();window.addEventListener("DOMContentLoaded",(function(){console.log("Custom components was loaded."),l.initialize(),Formio.Providers.addProvider("address","google",l),Formio.Components.addComponent("utilityproviderselect",v)}))})()})();
//# sourceMappingURL=formio.js.map