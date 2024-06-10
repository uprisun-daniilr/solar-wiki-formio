(()=>{"use strict";(()=>{function e(t){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},e(t)}function t(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,o(r.key),r)}}function o(t){var o=function(t,o){if("object"!=e(t)||!t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var r=n.call(t,"string");if("object"!=e(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t);return"symbol"==e(o)?o:o+""}function n(t,o,n){return o=a(o),function(t,o){if(o&&("object"==e(o)||"function"==typeof o))return o;if(void 0!==o)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(t)}(t,r()?Reflect.construct(o,n||[],a(t).constructor):o.apply(t,n))}function r(){try{var e=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(e){}return(r=function(){return!!e})()}function a(e){return a=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},a(e)}function i(e,t){return i=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},i(e,t)}var l=function(e){function o(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,o);for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];return n(this,o,[].concat(t))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&i(e,t)}(o,Formio.Providers.providers.address.google),r=o,l=[{key:"name",get:function(){return"google"}},{key:"displayName",get:function(){return"Google Maps"}},{key:"initialize",value:function(){var e=Formio.Components.components.address.editForm;Formio.Components.components.address.editForm=function(){var t=e.apply(void 0,arguments),o=t.components.find((function(e){return"tabs"===e.type})).components.find((function(e){return"provider"===e.key}));return o.components.push({type:"checkbox",input:!0,inputType:"checkbox",key:"providerOptions.params.isMapEnabled",label:"Show Map",defaultValue:!1,conditional:{json:{"===":[{var:"data.provider"},"google"]}}}),o.components.push({type:"number",input:!0,key:"providerOptions.params.defaultZoom",label:"Zoom",defaultValue:8,conditional:{json:{"===":[{var:"data.provider"},"google"]}}}),o.components.push({type:"number",input:!0,key:"providerOptions.params.defaultCenterLat",label:"Default Center Latitude",defaultValue:40.712776,conditional:{json:{"===":[{var:"data.provider"},"google"]}}}),o.components.push({type:"number",input:!0,key:"providerOptions.params.defaultCenterLng",label:"Default Center Longitude",defaultValue:-74.0059728,conditional:{json:{"===":[{var:"data.provider"},"google"]}}}),t}}}],(a=[{key:"updateMap",value:function(e){var t=e.lat,o=e.lng;this.marker.setPosition({lat:t,lng:o}),this.map.setCenter(this.marker.position)}},{key:"reverseGeocode",value:function(e,t){var o=this;(new google.maps.Geocoder).geocode({location:{lat:e,lng:t}},(function(n,r){var a=n[0];if("OK"===r&&a){var i=!0,l=o.options.params.autocompleteOptions;if(l.componentRestrictions&&l.componentRestrictions.country){var s=a.address_components.find((function(e){return-1!==e.types.indexOf("country")}));s?s.short_name.toLowerCase()!==l.componentRestrictions.country.toLowerCase()&&(i=!1):i=!1}if(!i)return;o.element&&(o.onSelectAddress(a,o.element),o.updateMap({lat:e,lng:t}))}else console.error("Geocoder failed due to:",r)}))}},{key:"initMap",value:function(e,t,o){var n=this;if(this.map=new google.maps.Map(e,{zoom:t,center:this.currentValue||o}),this.marker=new google.maps.Marker({position:this.currentValue||o,map:this.map,draggable:!0}),this.element.disabled||(google.maps.event.addListener(this.marker,"dragend",(function(e){var t=e.latLng.lat(),o=e.latLng.lng();n.reverseGeocode(t,o)})),google.maps.event.addListener(this.map,"click",(function(e){var t=e.latLng.lat(),o=e.latLng.lng();n.reverseGeocode(t,o)}))),this.element.value){var r={query:this.element.value,fields:["name","geometry"]};new google.maps.places.PlacesService(this.map).findPlaceFromQuery(r,(function(e,t){t===google.maps.places.PlacesServiceStatus.OK&&(n.map.setCenter(e[0].geometry.location),n.marker.setPosition(e[0].geometry.location))}))}}},{key:"attachAutocomplete",value:function(e,t,o){var n=this;this.onSelectAddress=o,this.element=e;var r=this.options.params,a=r.defaultCenterLat,i=r.defaultCenterLng,l=r.isMapEnabled,s=r.defaultZoom,c=document.createElement("div");c.style.height="400px",c.style["margin-top"]="16px",c.style.width="100%",c.style.background="#eee",l&&e.parentNode.insertBefore(c,e.nextSibling),Formio.libraryReady(this.getLibraryName()).then((function(){var r=new google.maps.places.Autocomplete(e,n.autocompleteOptions);r.addListener("place_changed",(function(){var a=n.filterPlace(r.getPlace()),i=a.geometry?{lat:a.geometry.location.lat(),lng:a.geometry.location.lng()}:null;l&&n.updateMap(i),a.formattedPlace=_.get(r,"gm_accessors_.place.se.formattedPrediction",a[n.alternativeDisplayValueProperty]),o(a,e,t)})),l&&n.initMap(c,s,{lat:a,lng:i})}))}}])&&t(r.prototype,a),l&&t(r,l),Object.defineProperty(r,"prototype",{writable:!1}),r;var r,a,l}();window.addEventListener("load",(function(){l.initialize(),Formio.Providers.addProvider("address","google",l)}))})()})();
//# sourceMappingURL=formio.js.map