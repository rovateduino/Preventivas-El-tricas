import{L as bo,I as rt,c as No,f as Se,F as Do,n as ko,l as Lo,x as Oo,k as ki,p as Mo,o as Uo,y as Fo,d as Re,z as qo,h as Bo,M as $o,A as zo,B as Go,X as Qo,G as jo,H as Tr,W as wn,J as Wo,K as Ms,_ as Ko,C as Ho,r as Us,S as Yo}from"./firebase-core-CwHpG5Y9.js";import{R as Qr}from"./vendor-DvgtHYTA.js";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Rt="12.19.0";function Jo(n){Rt=n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ot=new bo("@firebase/firestore");function mt(){return ot.logLevel}function w(n,...e){if(ot.logLevel<=Se.DEBUG){const t=e.map(jr);ot.debug(`Firestore (${Rt}): ${n}`,...t)}}function ke(n,...e){if(ot.logLevel<=Se.ERROR){const t=e.map(jr);ot.error(`Firestore (${Rt}): ${n}`,...t)}}function ye(n,...e){if(ot.logLevel<=Se.WARN){const t=e.map(jr);ot.warn(`Firestore (${Rt}): ${n}`,...t)}}function jr(n){if(typeof n=="string")return n;try{return(function(t){return JSON.stringify(t)})(n)}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function V(n,e,t){let r="Unexpected state";typeof e=="string"?r=e:t=e,Li(n,r,t)}function Li(n,e,t){let r=`FIRESTORE (${Rt}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;if(t!==void 0)try{r+=" CONTEXT: "+JSON.stringify(t)}catch{r+=" CONTEXT: "+t}throw ke(r),new Error(r)}function I(n,e,t,r){let s="Unexpected state";typeof t=="string"?s=t:r=t,n||Li(e,s,r)}function C(n,e){return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xo(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wr{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let r="";for(;r.length<20;){const s=Xo(40);for(let i=0;i<s.length;++i)r.length<20&&s[i]<t&&(r+=e.charAt(s[i]%62))}return r}}function b(n,e){return n<e?-1:n>e?1:0}function Cr(n,e){const t=Math.min(n.length,e.length);for(let r=0;r<t;r++){const s=n.charAt(r),i=e.charAt(r);if(s!==i)return Er(s)===Er(i)?b(s,i):Er(s)?1:-1}return b(n.length,e.length)}const Zo=55296,eu=57343;function Er(n){const e=n.charCodeAt(0);return e>=Zo&&e<=eu}function Et(n,e,t){return n.length===e.length&&n.every(((r,s)=>t(r,e[s])))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class O{constructor(e,t){this.comparator=e,this.root=t||H.EMPTY}insert(e,t){return new O(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,H.BLACK,null,null))}remove(e){return new O(this.comparator,this.root.remove(e,this.comparator).copy(null,null,H.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){const s=this.comparator(e,r.key);if(s===0)return t+r.left.size;s<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,r)=>(e(t,r),!1)))}toString(){const e=[];return this.inorderTraversal(((t,r)=>(e.push(`${t}:${r}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new In(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new In(this.root,e,this.comparator,!1)}getReverseIterator(){return new In(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new In(this.root,e,this.comparator,!0)}}class In{constructor(e,t,r,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?r(e.key,t):1,t&&s&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class H{constructor(e,t,r,s,i){this.key=e,this.value=t,this.color=r??H.RED,this.left=s??H.EMPTY,this.right=i??H.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,s,i){return new H(e??this.key,t??this.value,r??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let s=this;const i=r(e,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(e,t,r),null):i===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return H.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return H.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,H.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,H.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw V(43730,{key:this.key,value:this.value});if(this.right.isRed())throw V(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw V(27949);return e+(this.isRed()?0:1)}}H.EMPTY=null,H.RED=!0,H.BLACK=!1;H.EMPTY=new class{constructor(){this.size=0}get key(){throw V(57766)}get value(){throw V(16141)}get color(){throw V(16727)}get left(){throw V(29726)}get right(){throw V(36894)}copy(e,t,r,s,i){return this}insert(e,t,r){return new H(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class z{constructor(e){this.comparator=e,this.data=new O(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,r)=>(e(t),!1)))}forEachInRange(e,t){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const s=r.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Fs(this.data.getIterator())}getIteratorFrom(e){return new Fs(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((r=>{t=t.add(r)})),t}isEqual(e){if(!(e instanceof z)||this.size!==e.size)return!1;const t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=r.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new z(this.comparator);return t.data=e,t}}class Fs{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class E extends Do{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const we="__name__";class Ee{constructor(e,t,r){t===void 0?t=0:t>e.length&&V(637,{offset:t,range:e.length}),r===void 0?r=e.length-t:r>e.length-t&&V(1746,{length:r,range:e.length-t}),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return Ee.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Ee?e.forEach((r=>{t.push(r)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const r=Math.min(e.length,t.length);for(let s=0;s<r;s++){const i=Ee.compareSegments(e.get(s),t.get(s));if(i!==0)return i}return b(e.length,t.length)}static compareSegments(e,t){const r=Ee.isNumericId(e),s=Ee.isNumericId(t);return r&&!s?-1:!r&&s?1:r&&s?Ee.extractNumericId(e).compare(Ee.extractNumericId(t)):Cr(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return rt.fromString(e.substring(4,e.length-2))}}class D extends Ee{construct(e,t,r){return new D(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toStringWithLeadingSlash(){return`/${this.canonicalString()}`}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const r of e){if(r.indexOf("//")>=0)throw new E(_.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter((s=>s.length>0)))}return new D(t)}static emptyPath(){return new D([])}}const tu=/^[_a-zA-Z][_a-zA-Z0-9]*$/;let me=class ft extends Ee{construct(e,t,r){return new ft(e,t,r)}static isValidIdentifier(e){return tu.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),ft.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===we}static keyField(){return new ft([we])}static fromServerFormat(e){const t=[];let r="",s=0;const i=()=>{if(r.length===0)throw new E(_.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""};let a=!1;for(;s<e.length;){const o=e[s];if(o==="\\"){if(s+1===e.length)throw new E(_.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[s+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new E(_.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=u,s+=2}else o==="`"?(a=!a,s++):o!=="."||a?(r+=o,s++):(i(),s++)}if(i(),a)throw new E(_.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new ft(t)}static emptyPath(){return new ft([])}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class he{constructor(e){this.fields=e,e.sort(me.comparator)}static empty(){return new he([])}unionWith(e){let t=new z(me.comparator);for(const r of this.fields)t=t.add(r);for(const r of e)t=t.add(r);return new he(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Et(this.fields,e.fields,((t,r)=>t.isEqual(r)))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Dn(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function Xe(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function nu(n,e){const t=[];for(const r in n)Object.prototype.hasOwnProperty.call(n,r)&&t.push(e(n[r],r,n));return t}function Oi(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class A{constructor(e){this.path=e}static fromPath(e){return new A(D.fromString(e))}static fromName(e){return new A(D.fromString(e).popFirst(5))}static empty(){return new A(D.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&D.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return D.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new A(new D(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mi(n,e,t){if(!t)throw new E(_.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function ru(n,e,t,r){if(e===!0&&r===!0)throw new E(_.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function qs(n){if(!A.isDocumentKey(n))throw new E(_.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function Bs(n){if(A.isDocumentKey(n))throw new E(_.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function dn(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function Wn(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=(function(r){return r.constructor?r.constructor.name:null})(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":V(12329,{type:typeof n})}function Le(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new E(_.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Wn(n);throw new E(_.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $(n,e){const t={typeString:n};return e&&(t.value=e),t}function mn(n,e){if(!dn(n))throw new E(_.INVALID_ARGUMENT,"JSON must be an object");let t;for(const r in e)if(e[r]){const s=e[r].typeString,i="value"in e[r]?{value:e[r].value}:void 0;if(!(r in n)){t=`JSON missing required field: '${r}'`;break}const a=n[r];if(s&&typeof a!==s){t=`JSON field '${r}' must be a ${s}.`;break}if(i!==void 0&&a!==i.value){t=`Expected '${r}' field to equal '${i.value}'`;break}}if(t)throw new E(_.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $s=-62135596800,zs=1e6;class k{static now(){return k.fromMillis(Date.now())}static fromDate(e){return k.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),r=Math.floor((e-1e3*t)*zs);return new k(t,r)}static fromInstant(e){if(!e||typeof e.t!="bigint")throw new E(_.INVALID_ARGUMENT,"Invalid Temporal.Instant object provided.");return k._fromEpochNanoseconds(e.t)}static _fromEpochNanoseconds(e){let t,r;if(e>=0n)t=Number(e/1000000000n),r=Number(e%1000000000n);else{const s=e%1000000000n;s===0n?(t=Number(e/1000000000n),r=0):(t=Number(e/1000000000n-1n),r=Number(s+1000000000n))}return new k(t,r)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new E(_.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new E(_.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<$s)throw new E(_.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new E(_.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/zs}toInstant(){if(typeof Temporal>"u"||!Temporal.Instant)throw new E(_.FAILED_PRECONDITION,"The Temporal object is not available in the current environment.");const e=1000000000n*BigInt(this.seconds)+BigInt(this.nanoseconds);return Temporal.Instant.__PRIVATE_fromEpochNanoseconds(e)}_compareTo(e){return this.seconds===e.seconds?b(this.nanoseconds,e.nanoseconds):b(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:k._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(mn(e,k._jsonSchema))return new k(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-$s;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}k._jsonSchemaVersion="firestore/timestamp/1.0",k._jsonSchema={type:$("string",k._jsonSchemaVersion),seconds:$("number"),nanoseconds:$("number")};/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ui extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class G{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new Ui("Invalid base64 string: "+i):i}})(e);return new G(t)}static fromUint8Array(e){const t=(function(s){let i="";for(let a=0;a<s.length;++a)i+=String.fromCharCode(s[a]);return i})(e);return new G(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const r=new Uint8Array(t.length);for(let s=0;s<t.length;s++)r[s]=t.charCodeAt(s);return r})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return b(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}G.EMPTY_BYTE_STRING=new G("");const su=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Be(n){if(I(!!n,39018),typeof n=="string"){let e=0;const t=su.exec(n);if(I(!!t,46558,{timestamp:n}),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:M(n.seconds),nanos:M(n.nanos)}}function M(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function $e(n){return typeof n=="string"?G.fromBase64String(n):G.fromUint8Array(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fi="server_timestamp",qi="__type__",Bi="__previous_value__",$i="__local_write_time__";function Kn(n){var t,r;return((r=(((t=n==null?void 0:n.mapValue)==null?void 0:t.fields)||{})[qi])==null?void 0:r.stringValue)===Fi}function fn(n){const e=n.mapValue.fields[Bi];return Kn(e)?fn(e):e}function wt(n){const e=Be(n.mapValue.fields[$i].timestampValue);return new k(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iu{constructor(e,t,r,s,i,a,o,u,c,l,h,m,g){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=s,this.ssl=i,this.forceLongPolling=a,this.autoDetectLongPolling=o,this.longPollingOptions=u,this.useFetchStreams=c,this.isUsingEmulator=l,this.apiKey=h,this._customHeaders=m,this.grpcFlowControlWindow=g}}const kn="(default)";class Yt{constructor(e,t){this.projectId=e,this.database=t||kn}static empty(){return new Yt("","")}get isDefaultDatabase(){return this.database===kn}isEqual(e){return e instanceof Yt&&e.projectId===this.projectId&&e.database===this.database}}function au(n,e){if(!Object.prototype.hasOwnProperty.apply(n.options,["projectId"]))throw new E(_.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Yt(n.options.projectId,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kr=-1;function Hn(n){return n==null}function Jt(n){return n===0&&1/n==-1/0}function ou(n){return typeof n=="number"&&Number.isInteger(n)&&!Jt(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}function uu(n){return typeof n=="string"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zi="__type__",cu="__max__",An={mapValue:{}},Gi="__vector__",Xt="value",It={nullValue:"NULL_VALUE"},ae={booleanValue:!0},K={booleanValue:!1};function Q(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?Kn(n)?4:lu(n)?9007199254740991:Ln(n)?10:11:V(28295,{value:n})}function ge(n,e,t){if(n===e)return!0;const r=Q(n);if(r!==Q(e))return!1;switch(r){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return wt(n).isEqual(wt(e));case 3:return(function(i,a){if(typeof i.timestampValue=="string"&&typeof a.timestampValue=="string"&&i.timestampValue.length===a.timestampValue.length)return i.timestampValue===a.timestampValue;const o=Be(i.timestampValue),u=Be(a.timestampValue);return o.seconds===u.seconds&&o.nanos===u.nanos})(n,e);case 5:return n.stringValue===e.stringValue;case 6:return(function(i,a){return $e(i.bytesValue).isEqual($e(a.bytesValue))})(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return(function(i,a){return M(i.geoPointValue.latitude)===M(a.geoPointValue.latitude)&&M(i.geoPointValue.longitude)===M(a.geoPointValue.longitude)})(n,e);case 2:return(function(i,a,o){if("integerValue"in i&&"integerValue"in a)return M(i.integerValue)===M(a.integerValue);let u,c;if("doubleValue"in i&&"doubleValue"in a)u=M(i.doubleValue),c=M(a.doubleValue);else{if(!(o!=null&&o.i))return!1;u=M(i.integerValue??i.doubleValue),c=M(a.integerValue??a.doubleValue)}return u===c?!!(o!=null&&o.o)||Jt(u)===Jt(c):!!(o===void 0||o.u)&&isNaN(u)&&isNaN(c)})(n,e,t);case 9:return Et(n.arrayValue.values||[],e.arrayValue.values||[],((s,i)=>ge(s,i,t)));case 10:case 11:return(function(i,a,o){const u=i.mapValue.fields||{},c=a.mapValue.fields||{};if(Dn(u)!==Dn(c))return!1;for(const l in u)if(u.hasOwnProperty(l)&&(c[l]===void 0||!ge(u[l],c[l],o)))return!1;return!0})(n,e,t);default:return V(52216,{left:n})}}function Zt(n,e){return(n.values||[]).find((t=>ge(t,e)))!==void 0}function oe(n,e){if(n===e)return 0;const t=Q(n),r=Q(e);if(t!==r)return b(t,r);switch(t){case 0:case 9007199254740991:return 0;case 1:return b(n.booleanValue,e.booleanValue);case 2:return(function(i,a){const o=M(i.integerValue||i.doubleValue),u=M(a.integerValue||a.doubleValue);return o<u?-1:o>u?1:o===u?0:isNaN(o)?isNaN(u)?0:-1:1})(n,e);case 3:return Gs(n.timestampValue,e.timestampValue);case 4:return Gs(wt(n),wt(e));case 5:return Cr(n.stringValue,e.stringValue);case 6:return(function(i,a){const o=$e(i),u=$e(a);return o.compareTo(u)})(n.bytesValue,e.bytesValue);case 7:return(function(i,a){const o=i.split("/"),u=a.split("/");for(let c=0;c<o.length&&c<u.length;c++){const l=b(o[c],u[c]);if(l!==0)return l}return b(o.length,u.length)})(n.referenceValue,e.referenceValue);case 8:return(function(i,a){const o=b(M(i.latitude),M(a.latitude));return o!==0?o:b(M(i.longitude),M(a.longitude))})(n.geoPointValue,e.geoPointValue);case 9:return Qs(n.arrayValue,e.arrayValue);case 10:return(function(i,a){var m,g,y,S;const o=i.fields||{},u=a.fields||{},c=(m=o[Xt])==null?void 0:m.arrayValue,l=(g=u[Xt])==null?void 0:g.arrayValue,h=b(((y=c==null?void 0:c.values)==null?void 0:y.length)||0,((S=l==null?void 0:l.values)==null?void 0:S.length)||0);return h!==0?h:Qs(c,l)})(n.mapValue,e.mapValue);case 11:return(function(i,a){if(i===An.mapValue&&a===An.mapValue)return 0;if(i===An.mapValue)return 1;if(a===An.mapValue)return-1;const o=i.fields||{},u=Object.keys(o),c=a.fields||{},l=Object.keys(c);u.sort(),l.sort();for(let h=0;h<u.length&&h<l.length;++h){const m=Cr(u[h],l[h]);if(m!==0)return m;const g=oe(o[u[h]],c[l[h]]);if(g!==0)return g}return b(u.length,l.length)})(n.mapValue,e.mapValue);default:throw V(23264,{l:t})}}function Gs(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return b(n,e);const t=Be(n),r=Be(e),s=b(t.seconds,r.seconds);return s!==0?s:b(t.nanos,r.nanos)}function Qs(n,e){const t=n.values||[],r=e.values||[];for(let s=0;s<t.length&&s<r.length;++s){const i=oe(t[s],r[s]);if(i!==void 0&&i!==0)return i}return b(t.length,r.length)}function At(n){return Sr(n)}function Sr(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?(function(t){const r=Be(t);return`time(${r.seconds},${r.nanos})`})(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?(function(t){return $e(t).toBase64()})(n.bytesValue):"referenceValue"in n?(function(t){return A.fromName(t).toString()})(n.referenceValue):"geoPointValue"in n?(function(t){return`geo(${t.latitude},${t.longitude})`})(n.geoPointValue):"arrayValue"in n?(function(t){let r="[",s=!0;for(const i of t.values||[])s?s=!1:r+=",",r+=Sr(i);return r+"]"})(n.arrayValue):"mapValue"in n?(function(t){const r=Object.keys(t.fields||{}).sort();let s="{",i=!0;for(const a of r)i?i=!1:s+=",",s+=`${a}:${Sr(t.fields[a])}`;return s+"}"})(n.mapValue):V(61005,{value:n})}function Pn(n){switch(Q(n)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=fn(n);return e?16+Pn(e):16;case 5:return 2*n.stringValue.length;case 6:return $e(n.bytesValue).approximateByteSize();case 7:return n.referenceValue.length;case 9:return(function(r){return(r.values||[]).reduce(((s,i)=>s+Pn(i)),0)})(n.arrayValue);case 10:case 11:return(function(r){let s=0;return Xe(r.fields,((i,a)=>{s+=i.length+Pn(a)})),s})(n.mapValue);default:throw V(13486,{value:n})}}function js(n,e){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${e.path.canonicalString()}`}}function Ie(n){return!!n&&"integerValue"in n}function nt(n){return!!n&&"doubleValue"in n}function ze(n){return Ie(n)||nt(n)}function Vt(n){return!!n&&"arrayValue"in n}function de(n){return!!n&&"nullValue"in n}function ue(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function st(n){return!!n&&"mapValue"in n}function Ln(n){var t,r;return((r=(((t=n==null?void 0:n.mapValue)==null?void 0:t.fields)||{})[zi])==null?void 0:r.stringValue)===Gi}function xr(n){var e,t;return(t=(((e=n==null?void 0:n.mapValue)==null?void 0:e.fields)||{})[Xt])==null?void 0:t.arrayValue}function $t(n){if(n.geoPointValue)return{geoPointValue:{...n.geoPointValue}};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:{...n.timestampValue}};if(n.mapValue){const e={mapValue:{fields:{}}};return Xe(n.mapValue.fields,((t,r)=>e.mapValue.fields[t]=$t(r))),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=$t(n.arrayValue.values[t]);return e}return{...n}}function lu(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue===cu}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ne{constructor(e){this.value=e}static empty(){return new ne({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!st(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=$t(t)}setAll(e){let t=me.emptyPath(),r={},s=[];e.forEach(((a,o)=>{if(!t.isImmediateParentOf(o)){const u=this.getFieldsMap(t);this.applyChanges(u,r,s),r={},s=[],t=o.popLast()}a?r[o.lastSegment()]=$t(a):s.push(o.lastSegment())}));const i=this.getFieldsMap(t);this.applyChanges(i,r,s)}delete(e){const t=this.field(e.popLast());st(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return ge(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let s=t.mapValue.fields[e.get(r)];st(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,r){Xe(t,((s,i)=>e[s]=i));for(const s of r)delete e[s]}clone(){return new ne($t(this.value))}}function Qi(n){const e=[];return Xe(n.fields,((t,r)=>{const s=new me([t]);if(st(r)){const i=Qi(r.mapValue).fields;if(i.length===0)e.push(s);else for(const a of i)e.push(s.child(a))}else e.push(s)})),new he(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yn(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Jt(e)?"-0":e}}function Hr(n){return{integerValue:""+n}}function Yr(n,e,t){return ou(e)?Hr(e):Yn(n,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jn{constructor(){this._=void 0}}function hu(n,e,t){return n instanceof On?(function(s,i){const a={fields:{[qi]:{stringValue:Fi},[$i]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&Kn(i)&&(i=fn(i)),i&&(a.fields[Bi]=i),{mapValue:a}})(t,e):n instanceof en?Wi(n,e):n instanceof tn?Ki(n,e):n instanceof nn?(function(s,i){const a=ji(s,i),o=Fn(a)+Fn(s.h);return Ie(a)&&Ie(s.h)?Hr(o):Yn(s.serializer,o)})(n,e):n instanceof Mn?(function(s,i){return Ws(s,i,Math.min)})(n,e):n instanceof Un?(function(s,i){return Ws(s,i,Math.max)})(n,e):void 0}function du(n,e,t){return n instanceof en?Wi(n,e):n instanceof tn?Ki(n,e):t}function ji(n,e){return n instanceof nn?ze(e)?e:{integerValue:0}:null}class On extends Jn{}class en extends Jn{constructor(e){super(),this.elements=e}}function Wi(n,e){const t=Hi(e);for(const r of n.elements)t.some((s=>ge(s,r)))||t.push(r);return{arrayValue:{values:t}}}class tn extends Jn{constructor(e){super(),this.elements=e}}function Ki(n,e){let t=Hi(e);for(const r of n.elements)t=t.filter((s=>!ge(s,r)));return{arrayValue:{values:t}}}class Jr extends Jn{constructor(e,t){super(),this.serializer=e,this.h=t}}class nn extends Jr{}class Mn extends Jr{}class Un extends Jr{}function Ws(n,e,t){if(!ze(e))return n.h;const r=t(Fn(e),Fn(n.h));return Ie(e)&&Ie(n.h)?Hr(r):Yn(n.serializer,r)}function Fn(n){return M(n.integerValue||n.doubleValue)}function Hi(n){return Vt(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}function mu(n,e){return n.field.isEqual(e.field)&&(function(r,s){return r instanceof en&&s instanceof en||r instanceof tn&&s instanceof tn?Et(r.elements,s.elements,ge):r instanceof nn&&s instanceof nn||r instanceof Mn&&s instanceof Mn||r instanceof Un&&s instanceof Un?ge(r.h,s.h):r instanceof On&&s instanceof On})(n.transform,e.transform)}class fu{constructor(e,t){this.version=e,this.transformResults=t}}class fe{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new fe}static exists(e){return new fe(void 0,e)}static updateTime(e){return new fe(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Cn(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class Xn{}function Yi(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new Zn(n.key,fe.none()):new _n(n.key,n.data,fe.none());{const t=n.data,r=ne.empty();let s=new z(me.comparator);for(let i of e.fields)if(!s.has(i)){let a=t.field(i);a===null&&i.length>1&&(i=i.popLast(),a=t.field(i)),a===null?r.delete(i):r.set(i,a),s=s.add(i)}return new Ze(n.key,r,new he(s.toArray()),fe.none())}}function _u(n,e,t){n instanceof _n?(function(s,i,a){const o=s.value.clone(),u=Hs(s.fieldTransforms,i,a.transformResults);o.setAll(u),i.convertToFoundDocument(a.version,o).setHasCommittedMutations()})(n,e,t):n instanceof Ze?(function(s,i,a){if(!Cn(s.precondition,i))return void i.convertToUnknownDocument(a.version);const o=Hs(s.fieldTransforms,i,a.transformResults),u=i.data;u.setAll(Ji(s)),u.setAll(o),i.convertToFoundDocument(a.version,u).setHasCommittedMutations()})(n,e,t):(function(s,i,a){i.convertToNoDocument(a.version).setHasCommittedMutations()})(0,e,t)}function zt(n,e,t,r){return n instanceof _n?(function(i,a,o,u){if(!Cn(i.precondition,a))return o;const c=i.value.clone(),l=Ys(i.fieldTransforms,u,a);return c.setAll(l),a.convertToFoundDocument(a.version,c).setHasLocalMutations(),null})(n,e,t,r):n instanceof Ze?(function(i,a,o,u){if(!Cn(i.precondition,a))return o;const c=Ys(i.fieldTransforms,u,a),l=a.data;return l.setAll(Ji(i)),l.setAll(c),a.convertToFoundDocument(a.version,l).setHasLocalMutations(),o===null?null:o.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map((h=>h.field)))})(n,e,t,r):(function(i,a,o){return Cn(i.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):o})(n,e,t)}function pu(n,e){let t=null;for(const r of n.fieldTransforms){const s=e.data.field(r.field),i=ji(r.transform,s||null);i!=null&&(t===null&&(t=ne.empty()),t.set(r.field,i))}return t||null}function Ks(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!(function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&Et(r,s,((i,a)=>mu(i,a)))})(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class _n extends Xn{constructor(e,t,r,s=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class Ze extends Xn{constructor(e,t,r,s,i=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function Ji(n){const e=new Map;return n.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const r=n.data.field(t);e.set(t,r)}})),e}function Hs(n,e,t){const r=new Map;I(n.length===t.length,32656,{T:t.length,P:n.length});for(let s=0;s<t.length;s++){const i=n[s],a=i.transform,o=e.data.field(i.field);r.set(i.field,du(a,o,t[s]))}return r}function Ys(n,e,t){const r=new Map;for(const s of n){const i=s.transform,a=t.data.field(s.field);r.set(s.field,hu(i,a,e))}return r}class Zn extends Xn{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class gu extends Xn{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qn{constructor(e,t){this.position=e,this.inclusive=t}}function Js(n,e,t){let r=0;for(let s=0;s<n.position.length;s++){const i=e[s],a=n.position[s];if(i.field.isKeyField()?r=A.comparator(A.fromName(a.referenceValue),t.key):r=oe(a,t.data.field(i.field)),i.dir==="desc"&&(r*=-1),r!==0)break}return r}function Xs(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!ge(n.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xi{}class B extends Xi{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,r):new Tu(e,t,r):t==="array-contains"?new Iu(e,r):t==="in"?new Au(e,r):t==="not-in"?new Vu(e,r):t==="array-contains-any"?new vu(e,r):new B(e,t,r)}static createKeyFieldInFilter(e,t,r){return t==="in"?new Eu(e,r):new wu(e,r)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(oe(t,this.value)):t!==null&&Q(this.value)===Q(t)&&this.matchesComparison(oe(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return V(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Te extends Xi{constructor(e,t){super(),this.filters=e,this.op=t,this.I=null}static create(e,t){return new Te(e,t)}matches(e){return Zi(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.I!==null||(this.I=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.I}getFilters(){return Object.assign([],this.filters)}}function Zi(n){return n.op==="and"}function ea(n){return yu(n)&&Zi(n)}function yu(n){for(const e of n.filters)if(e instanceof Te)return!1;return!0}function br(n){if(n instanceof B)return n.field.canonicalString()+n.op.toString()+At(n.value);if(ea(n))return n.filters.map((e=>br(e))).join(",");{const e=n.filters.map((t=>br(t))).join(",");return`${n.op}(${e})`}}function ta(n,e){return n instanceof B?(function(r,s){return s instanceof B&&r.op===s.op&&r.field.isEqual(s.field)&&ge(r.value,s.value)})(n,e):n instanceof Te?(function(r,s){return s instanceof Te&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce(((i,a,o)=>i&&ta(a,s.filters[o])),!0):!1})(n,e):void V(19439)}function na(n){return n instanceof B?(function(t){return`${t.field.canonicalString()} ${t.op} ${At(t.value)}`})(n):n instanceof Te?(function(t){return t.op.toString()+" {"+t.getFilters().map(na).join(" ,")+"}"})(n):"Filter"}class Tu extends B{constructor(e,t,r){super(e,t,r),this.key=A.fromName(r.referenceValue)}matches(e){const t=A.comparator(e.key,this.key);return this.matchesComparison(t)}}class Eu extends B{constructor(e,t){super(e,"in",t),this.keys=ra("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class wu extends B{constructor(e,t){super(e,"not-in",t),this.keys=ra("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function ra(n,e){var t;return(((t=e.arrayValue)==null?void 0:t.values)||[]).map((r=>A.fromName(r.referenceValue)))}class Iu extends B{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Vt(t)&&Zt(t.arrayValue,this.value)}}class Au extends B{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&Zt(this.value.arrayValue,t)}}class Vu extends B{constructor(e,t){super(e,"not-in",t)}matches(e){if(Zt(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!Zt(this.value.arrayValue,t)}}class vu extends B{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Vt(t)||!t.arrayValue.values)&&t.arrayValue.values.some((r=>Zt(this.value.arrayValue,r)))}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rn{constructor(e,t="asc"){this.field=e,this.dir=t}}function Ru(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class P{static fromTimestamp(e){return new P(e)}static min(){return new P(new k(0,0))}static max(){return new P(new k(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Z{constructor(e,t,r,s,i,a,o){this.key=e,this.documentType=t,this.version=r,this.readTime=s,this.createTime=i,this.data=a,this.documentState=o}static newInvalidDocument(e){return new Z(e,0,P.min(),P.min(),P.min(),ne.empty(),0)}static newFoundDocument(e,t,r,s){return new Z(e,1,t,P.min(),r,s,0)}static newNoDocument(e,t){return new Z(e,2,t,P.min(),P.min(),ne.empty(),0)}static newUnknownDocument(e,t){return new Z(e,3,t,P.min(),P.min(),ne.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(P.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=ne.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=ne.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=P.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Z&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Z(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sn=-1;function Pu(n,e){const t=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,s=P.fromTimestamp(r===1e9?new k(t+1,0):new k(t,r));return new Ge(s,A.empty(),e)}function Cu(n){return new Ge(n.readTime,n.key,sn)}class Ge{constructor(e,t,r){this.readTime=e,this.documentKey=t,this.largestBatchId=r}static min(){return new Ge(P.min(),A.empty(),sn)}static max(){return new Ge(P.max(),A.empty(),sn)}}function Su(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=A.comparator(n.documentKey,e.documentKey),t!==0?t:b(n.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xu{constructor(e,t=null,r=[],s=[],i=null,a=null,o=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=s,this.limit=i,this.startAt=a,this.endAt=o,this.R=null}}function Zs(n,e=null,t=[],r=[],s=null,i=null,a=null){return new xu(n,e,t,r,s,i,a)}function sa(n){const e=C(n);if(e.R===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((r=>br(r))).join(","),t+="|ob:",t+=e.orderBy.map((r=>(function(i){return i.field.canonicalString()+i.dir})(r))).join(","),Hn(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((r=>At(r))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((r=>At(r))).join(",")),e.R=t}return e.R}function ia(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!Ru(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!ta(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!Xs(n.startAt,e.startAt)&&Xs(n.endAt,e.endAt)}function tt(n){return!!n.isCorePipeline}function aa(n){return!!n.path&&A.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pt{constructor(e,t=null,r=[],s=[],i=null,a="F",o=null,u=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=s,this.limit=i,this.limitType=a,this.startAt=o,this.endAt=u,this.A=null,this.V=null,this.m=null,this.startAt,this.endAt}}function bu(n,e,t,r,s,i,a,o){return new Pt(n,e,t,r,s,i,a,o)}function Xr(n){return new Pt(n)}function ei(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function Nu(n){return A.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}function oa(n){return n.collectionGroup!==null}function Gt(n){const e=C(n);if(e.A===null){e.A=[];const t=new Set;for(const i of e.explicitOrderBy)e.A.push(i),t.add(i.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(a){let o=new z(me.comparator);return a.filters.forEach((u=>{u.getFlattenedFilters().forEach((c=>{c.isInequality()&&(o=o.add(c.field))}))})),o})(e).forEach((i=>{t.has(i.canonicalString())||i.isKeyField()||e.A.push(new rn(i,r))})),t.has(me.keyField().canonicalString())||e.A.push(new rn(me.keyField(),r))}return e.A}function Ae(n){const e=C(n);return e.V||(e.V=Du(e,Gt(n))),e.V}function Du(n,e){if(n.limitType==="F")return Zs(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map((s=>{const i=s.dir==="desc"?"asc":"desc";return new rn(s.field,i)}));const t=n.endAt?new qn(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new qn(n.startAt.position,n.startAt.inclusive):null;return Zs(n.path,n.collectionGroup,e,n.filters,n.limit,t,r)}}function Nr(n,e){const t=n.filters.concat([e]);return new Pt(n.path,n.collectionGroup,n.explicitOrderBy.slice(),t,n.limit,n.limitType,n.startAt,n.endAt)}function ku(n,e){const t=n.explicitOrderBy.concat([e]);return new Pt(n.path,n.collectionGroup,t,n.filters.slice(),n.limit,n.limitType,n.startAt,n.endAt)}function Dr(n,e,t){return new Pt(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function Lu(n,e){return ia(Ae(n),Ae(e))&&n.limitType===e.limitType}function Qt(n){return`Query(target=${(function(t){let r=t.path.canonicalString();return t.collectionGroup!==null&&(r+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(r+=`, filters: [${t.filters.map((s=>na(s))).join(", ")}]`),Hn(t.limit)||(r+=", limit: "+t.limit),t.orderBy.length>0&&(r+=`, orderBy: [${t.orderBy.map((s=>(function(a){return`${a.field.canonicalString()} (${a.dir})`})(s))).join(", ")}]`),t.startAt&&(r+=", startAt: ",r+=t.startAt.inclusive?"b:":"a:",r+=t.startAt.position.map((s=>At(s))).join(",")),t.endAt&&(r+=", endAt: ",r+=t.endAt.inclusive?"a:":"b:",r+=t.endAt.position.map((s=>At(s))).join(",")),`Target(${r})`})(Ae(n))}; limitType=${n.limitType})`}function er(n,e){return e.isFoundDocument()&&(function(r,s){const i=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(i):A.isDocumentKey(r.path)?r.path.isEqual(i):r.path.isImmediateParentOf(i)})(n,e)&&(function(r,s){for(const i of Gt(r))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0})(n,e)&&(function(r,s){for(const i of r.filters)if(!i.matches(s))return!1;return!0})(n,e)&&(function(r,s){return!(r.startAt&&!(function(a,o,u){const c=Js(a,o,u);return a.inclusive?c<=0:c<0})(r.startAt,Gt(r),s)||r.endAt&&!(function(a,o,u){const c=Js(a,o,u);return a.inclusive?c>=0:c>0})(r.endAt,Gt(r),s))})(n,e)}function Zr(n){return(e,t)=>{let r=!1;for(const s of Gt(n)){const i=Ou(s,e,t);if(i!==0)return i;r=r||s.field.isKeyField()}return 0}}function Ou(n,e,t){const r=n.field.isKeyField()?A.comparator(e.key,t.key):(function(i,a,o){const u=a.data.field(i),c=o.data.field(i);return u!==null&&c!==null?oe(u,c):V(42886)})(n.field,e,t);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return V(19790,{direction:n.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mu{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var q,N;function Uu(n){switch(n){case _.OK:return V(64938);case _.CANCELLED:case _.UNKNOWN:case _.DEADLINE_EXCEEDED:case _.RESOURCE_EXHAUSTED:case _.INTERNAL:case _.UNAVAILABLE:case _.UNAUTHENTICATED:return!1;case _.INVALID_ARGUMENT:case _.NOT_FOUND:case _.ALREADY_EXISTS:case _.PERMISSION_DENIED:case _.FAILED_PRECONDITION:case _.ABORTED:case _.OUT_OF_RANGE:case _.UNIMPLEMENTED:case _.DATA_LOSS:return!0;default:return V(15467,{code:n})}}function ua(n){if(n===void 0)return ke("GRPC error has no .code"),_.UNKNOWN;switch(n){case q.OK:return _.OK;case q.CANCELLED:return _.CANCELLED;case q.UNKNOWN:return _.UNKNOWN;case q.DEADLINE_EXCEEDED:return _.DEADLINE_EXCEEDED;case q.RESOURCE_EXHAUSTED:return _.RESOURCE_EXHAUSTED;case q.INTERNAL:return _.INTERNAL;case q.UNAVAILABLE:return _.UNAVAILABLE;case q.UNAUTHENTICATED:return _.UNAUTHENTICATED;case q.INVALID_ARGUMENT:return _.INVALID_ARGUMENT;case q.NOT_FOUND:return _.NOT_FOUND;case q.ALREADY_EXISTS:return _.ALREADY_EXISTS;case q.PERMISSION_DENIED:return _.PERMISSION_DENIED;case q.FAILED_PRECONDITION:return _.FAILED_PRECONDITION;case q.ABORTED:return _.ABORTED;case q.OUT_OF_RANGE:return _.OUT_OF_RANGE;case q.UNIMPLEMENTED:return _.UNIMPLEMENTED;case q.DATA_LOSS:return _.DATA_LOSS;default:return V(39323,{code:n})}}(N=q||(q={}))[N.OK=0]="OK",N[N.CANCELLED=1]="CANCELLED",N[N.UNKNOWN=2]="UNKNOWN",N[N.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",N[N.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",N[N.NOT_FOUND=5]="NOT_FOUND",N[N.ALREADY_EXISTS=6]="ALREADY_EXISTS",N[N.PERMISSION_DENIED=7]="PERMISSION_DENIED",N[N.UNAUTHENTICATED=16]="UNAUTHENTICATED",N[N.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",N[N.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",N[N.ABORTED=10]="ABORTED",N[N.OUT_OF_RANGE=11]="OUT_OF_RANGE",N[N.UNIMPLEMENTED=12]="UNIMPLEMENTED",N[N.INTERNAL=13]="INTERNAL",N[N.UNAVAILABLE=14]="UNAVAILABLE",N[N.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ct{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r!==void 0){for(const[s,i]of r)if(this.equalsFn(s,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){const r=this.mapKeyFn(e),s=this.inner[r];if(s===void 0)return this.inner[r]=[[e,t]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return void(s[i]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return r.length===1?delete this.inner[t]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(e){Xe(this.inner,((t,r)=>{for(const[s,i]of r)e(s,i)}))}isEmpty(){return Oi(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fu=new O(A.comparator);function se(){return Fu}const ca=new O(A.comparator);function _t(...n){let e=ca;for(const t of n)e=e.insert(t.key,t);return e}function la(n){let e=ca;return n.forEach(((t,r)=>e=e.insert(t,r.overlayedDocument))),e}function Me(){return jt()}function ha(){return jt()}function jt(){return new ct((n=>n.toString()),((n,e)=>n.isEqual(e)))}const qu=new O(A.comparator),Bu=new z(A.comparator);function x(...n){let e=Bu;for(const t of n)e=e.add(t);return e}const $u=new z(b);function zu(){return $u}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gu(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qu=new rt([4294967295,4294967295],0);function ti(n){const e=Gu().encode(n),t=new $o;return t.update(e),new Uint8Array(t.digest())}function ni(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),r=e.getUint32(4,!0),s=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new rt([t,r],0),new rt([s,i],0)]}class es{constructor(e,t,r){if(this.bitmap=e,this.padding=t,this.hashCount=r,t<0||t>=8)throw new Ft(`Invalid padding: ${t}`);if(r<0)throw new Ft(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new Ft(`Invalid hash count: ${r}`);if(e.length===0&&t!==0)throw new Ft(`Invalid padding when bitmap length is 0: ${t}`);this.p=8*e.length-t,this.S=rt.fromNumber(this.p)}v(e,t,r){let s=e.add(t.multiply(rt.fromNumber(r)));return s.compare(Qu)===1&&(s=new rt([s.getBits(0),s.getBits(1)],0)),s.modulo(this.S).toNumber()}D(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.p===0)return!1;const t=ti(e),[r,s]=ni(t);for(let i=0;i<this.hashCount;i++){const a=this.v(r,s,i);if(!this.D(a))return!1}return!0}static create(e,t,r){const s=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),a=new es(i,s,t);return r.forEach((o=>a.insert(o))),a}insert(e){if(this.p===0)return;const t=ti(e),[r,s]=ni(t);for(let i=0;i<this.hashCount;i++){const a=this.v(r,s,i);this.C(a)}}C(e){const t=Math.floor(e/8),r=e%8;this.bitmap[t]|=1<<r}}class Ft extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pn{constructor(e,t,r,s,i,a){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=r,this.documentUpdates=s,this.augmentedDocumentUpdates=i,this.resolvedLimboDocuments=a}static createSynthesizedRemoteEventForCurrentChange(e,t,r){const s=new Map;return s.set(e,gn.createSynthesizedTargetChangeForCurrentChange(e,t,r)),new pn(P.min(),s,new O(b),se(),se(),x())}}class gn{constructor(e,t,r,s,i){this.resumeToken=e,this.current=t,this.addedDocuments=r,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,r){return new gn(r,t,x(),x(),x())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sn{constructor(e,t,r,s){this.F=e,this.removedTargetIds=t,this.key=r,this.O=s}}class da{constructor(e,t){this.targetId=e,this.M=t}}class ma{constructor(e,t,r=G.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=r,this.cause=s}}class ri{constructor(e){this.targetId=e,this.N=0,this.L=si(),this.B=G.EMPTY_BYTE_STRING,this.U=!1,this.k=!0}get current(){return this.U}get resumeToken(){return this.B}get q(){return this.N!==0}get $(){return this.k}K(e){e.approximateByteSize()>0&&(this.k=!0,this.B=e)}W(){let e=x(),t=x(),r=x();return this.L.forEach(((s,i)=>{switch(i){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:r=r.add(s);break;default:V(38017,{changeType:i})}})),new gn(this.B,this.U,e,t,r)}G(){this.k=!1,this.L=si()}j(e,t){this.k=!0,this.L=this.L.insert(e,t)}H(e){this.k=!0,this.L=this.L.remove(e)}J(){this.N+=1}Y(){this.N-=1,I(this.N>=0,3241,{N:this.N,targetId:this.targetId})}Z(){this.k=!0,this.U=!0}}const Mt="WatchChangeAggregator";class ju{constructor(e){this.X=e,this.ee=new Map,this.te=se(),this.ne=Vn(),this.re=se(),this.ie=Vn(),this.se=new O(b)}_e(e){for(const t of e.F)e.O&&e.O.isFoundDocument()?this.oe(t,e.O):this.ae(t,e.key,e.O);for(const t of e.removedTargetIds)this.ae(t,e.key,e.O)}ue(e){this.forEachTarget(e,(t=>{const r=this.ee.get(t);if(r)switch(e.state){case 0:this.ce(t)&&r.K(e.resumeToken);break;case 1:r.Y(),r.q||r.G(),r.K(e.resumeToken);break;case 2:r.Y(),r.q||this.removeTarget(t);break;case 3:this.ce(t)&&(r.Z(),r.K(e.resumeToken));break;case 4:this.ce(t)&&(this.le(t),r.K(e.resumeToken));break;default:V(56790,{state:e.state})}else w(Mt,`handleTargetChange received targetChange for untracked target ID (${t}) with state (${e.state})`)}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.ee.forEach(((r,s)=>{this.ce(s)&&t(s)}))}Ee(e){var t;return tt(e)?e.getPipelineSourceType()==="documents"&&((t=e.getPipelineDocuments())==null?void 0:t.length)===1:aa(e)}he(e){const t=e.targetId,r=e.M.count,s=this.Te(t);if(s){const i=s.target;if(this.Ee(i))if(r===0){const a=new A(tt(i)?D.fromString(i.getPipelineDocuments()[0]):i.path);this.ae(t,a,Z.newNoDocument(a,P.min()))}else I(r===1,20013,"Single document existence filter with count: "+r);else{const a=this.Pe(t);if(a!==r){const o=this.Ie(e),u=o?this.Re(o,e,a):1;if(u!==0){this.le(t);const c=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.se=this.se.insert(t,c)}}}}}Ie(e){const t=e.M.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:r="",padding:s=0},hashCount:i=0}=t;let a,o;try{a=$e(r).toUint8Array()}catch(u){if(u instanceof Ui)return ye("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{o=new es(a,s,i)}catch(u){return ye(u instanceof Ft?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return o.p===0?null:o}Re(e,t,r){return t.M.count===r-this.de(e,t.targetId)?0:2}de(e,t){const r=this.X.getRemoteKeysForTarget(t);let s=0;return r.forEach((i=>{const a=this.X.Ve(),o=`projects/${a.projectId}/databases/${a.database}/documents/${i.path.canonicalString()}`;e.mightContain(o)||(this.ae(t,i,null),s++)})),s}fe(e){const t=new Map;this.ee.forEach(((i,a)=>{const o=this.Te(a);if(o){if(i.current&&this.Ee(o.target)){const u=tt(o.target)?D.fromString(o.target.getPipelineDocuments()[0]):o.target.path,c=new A(u);this.me(c).has(a)||this.pe(a,c)||this.ae(a,c,Z.newNoDocument(c,e))}i.$&&(t.set(a,i.W()),i.G())}}));let r=x();this.ie.forEach(((i,a)=>{let o=!0;a.forEachWhile((u=>{const c=this.Te(u);return!c||c.purpose==="TargetPurposeLimboResolution"||(o=!1,!1)})),o&&(r=r.add(i))})),this.te.forEach(((i,a)=>a.setReadTime(e))),this.re.forEach(((i,a)=>a.setReadTime(e)));const s=new pn(e,t,this.se,this.te,this.re,r);return this.te=se(),this.ne=Vn(),this.re=se(),this.ie=Vn(),this.se=new O(b),s}oe(e,t){const r=this.ee.get(e);if(!r||!this.ce(e))return void w(Mt,`addDocumentToTarget received document for unknown inactive target (${e})`);const s=this.pe(e,t.key)?2:0;r.j(t.key,s),tt(this.Te(e).target)&&this.Te(e).target.getPipelineFlavor()!=="exact"?this.re=this.re.insert(t.key,t):this.te=this.te.insert(t.key,t),this.ne=this.ne.insert(t.key,this.me(t.key).add(e)),this.ie=this.ie.insert(t.key,this.ge(t.key).add(e))}ae(e,t,r){const s=this.ee.get(e);s&&this.ce(e)?(this.pe(e,t)?s.j(t,1):s.H(t),this.ie=this.ie.insert(t,this.ge(t).delete(e)),this.ie=this.ie.insert(t,this.ge(t).add(e)),r&&(tt(this.Te(e).target)&&this.Te(e).target.getPipelineFlavor()!=="exact"?this.re=this.re.insert(t,r):this.te=this.te.insert(t,r))):w(Mt,`removeDocumentFromTarget received document for unknown or inactive target (${e})`)}removeTarget(e){this.ee.delete(e)}Pe(e){const t=this.ee.get(e);if(!t)return 0;const r=t.W();return this.X.getRemoteKeysForTarget(e).size+r.addedDocuments.size-r.removedDocuments.size}J(e){let t=this.ee.get(e);t||(w(Mt,`recordPendingTargetRequest set up tracking for target ID ${e}`),t=new ri(e),this.ee.set(e,t)),t.J()}ge(e){let t=this.ie.get(e);return t||(t=new z(b),this.ie=this.ie.insert(e,t)),t}me(e){let t=this.ne.get(e);return t||(t=new z(b),this.ne=this.ne.insert(e,t)),t}ce(e){const t=this.Te(e)!==null;return t||w(Mt,"Detected inactive target",e),t}Te(e){const t=this.ee.get(e);return t===void 0||t.q?null:this.X.ye(e)}le(e){this.ee.set(e,new ri(e)),this.X.getRemoteKeysForTarget(e).forEach((t=>{this.ae(e,t,null)}))}pe(e,t){return this.X.getRemoteKeysForTarget(e).has(t)}}function Vn(){return new O(A.comparator)}function si(){return new O(A.comparator)}const Wu={asc:"ASCENDING",desc:"DESCENDING"},Ku={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},Hu={and:"AND",or:"OR"};class Yu{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function kr(n,e){return n.useProto3Json||Hn(e)?e:{value:e}}function Wt(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function ts(n){const e=Be(n);return new k(e.seconds,e.nanos)}function fa(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function xn(n,e){return Wt(n,e.toTimestamp())}function Ve(n){return I(!!n,49232),P.fromTimestamp(ts(n))}function ns(n,e){return Lr(n,e).canonicalString()}function Lr(n,e){const t=(function(s){return new D(["projects",s.projectId,"databases",s.database])})(n).child("documents");return e===void 0?t:t.child(e)}function _a(n){const e=D.fromString(n);return I(Ea(e),10190,{key:e.toString()}),e}function Bn(n,e){return ns(n.databaseId,e.path)}function wr(n,e){const t=_a(e);if(t.get(1)!==n.databaseId.projectId)throw new E(_.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new E(_.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new A(ga(t))}function pa(n,e){return ns(n.databaseId,e)}function Ju(n){const e=_a(n);return e.length===4?D.emptyPath():ga(e)}function Or(n){return new D(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function ga(n){return I(n.length>4&&n.get(4)==="documents",29091,{key:n.toString()}),n.popFirst(5)}function ii(n,e,t){return{name:Bn(n,e),fields:t.value.mapValue.fields}}function Xu(n,e){let t;if("targetChange"in e){e.targetChange;const r=(function(c){return c==="NO_CHANGE"?0:c==="ADD"?1:c==="REMOVE"?2:c==="CURRENT"?3:c==="RESET"?4:V(39313,{state:c})})(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],i=(function(c,l){return c.useProto3Json?(I(l===void 0||typeof l=="string",58123),G.fromBase64String(l||"")):(I(l===void 0||l instanceof Buffer||l instanceof Uint8Array,16193),G.fromUint8Array(l||new Uint8Array))})(n,e.targetChange.resumeToken),a=e.targetChange.cause,o=a&&(function(c){const l=c.code===void 0?_.UNKNOWN:ua(c.code);return new E(l,c.message||"")})(a);t=new ma(r,s,i,o||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const s=wr(n,r.document.name),i=Ve(r.document.updateTime),a=r.document.createTime?Ve(r.document.createTime):P.min(),o=new ne({mapValue:{fields:r.document.fields}}),u=Z.newFoundDocument(s,i,a,o),c=r.targetIds||[],l=r.removedTargetIds||[];t=new Sn(c,l,u.key,u)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const s=wr(n,r.document),i=r.readTime?Ve(r.readTime):P.min(),a=Z.newNoDocument(s,i),o=r.removedTargetIds||[];t=new Sn([],o,a.key,a)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const s=wr(n,r.document),i=r.removedTargetIds||[];t=new Sn([],i,s,null)}else{if(!("filter"in e))return V(11601,{we:e});{e.filter;const r=e.filter;r.targetId;const{count:s=0,unchangedNames:i}=r,a=new Mu(s,i),o=r.targetId;t=new da(o,a)}}return t}function Zu(n,e){let t;if(e instanceof _n)t={update:ii(n,e.key,e.value)};else if(e instanceof Zn)t={delete:Bn(n,e.key)};else if(e instanceof Ze)t={update:ii(n,e.key,e.data),updateMask:cc(e.fieldMask)};else{if(!(e instanceof gu))return V(16599,{be:e.type});t={verify:Bn(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((r=>(function(i,a){const o=a.transform;if(o instanceof On)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(o instanceof en)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:o.elements}};if(o instanceof tn)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:o.elements}};if(o instanceof nn)return{fieldPath:a.field.canonicalString(),increment:o.h};if(o instanceof Mn)return{fieldPath:a.field.canonicalString(),minimum:o.h};if(o instanceof Un)return{fieldPath:a.field.canonicalString(),maximum:o.h};throw V(20930,{transform:a.transform})})(0,r)))),e.precondition.isNone||(t.currentDocument=(function(s,i){return i.updateTime!==void 0?{updateTime:xn(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:V(27497)})(n,e.precondition)),t}function ec(n,e){return n&&n.length>0?(I(e!==void 0,14353),n.map((t=>(function(s,i){let a=s.updateTime?Ve(s.updateTime):Ve(i);return a.isEqual(P.min())&&(a=Ve(i)),new fu(a,s.transformResults||[])})(t,e)))):[]}function tc(n,e){return{documents:[pa(n,e.path)]}}function nc(n,e){const t={structuredQuery:{}},r=e.path;let s;e.collectionGroup!==null?(s=r,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=r.popLast(),t.structuredQuery.from=[{collectionId:r.lastSegment()}]),t.parent=pa(n,s);const i=(function(c){if(c.length!==0)return Ta(Te.create(c,"and"))})(e.filters);i&&(t.structuredQuery.where=i);const a=(function(c){if(c.length!==0)return c.map((l=>(function(m){return{field:pt(m.field),direction:ac(m.dir)}})(l)))})(e.orderBy);a&&(t.structuredQuery.orderBy=a);const o=kr(n,e.limit);return o!==null&&(t.structuredQuery.limit=o),e.startAt&&(t.structuredQuery.startAt=(function(c){return{before:c.inclusive,values:c.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(c){return{before:!c.inclusive,values:c.position}})(e.endAt)),{Se:t,parent:s}}function rc(n){let e=Ju(n.parent);const t=n.structuredQuery,r=t.from?t.from.length:0;let s=null;if(r>0){I(r===1,65062);const l=t.from[0];l.allDescendants?s=l.collectionId:e=e.child(l.collectionId)}let i=[];t.where&&(i=(function(h){const m=ya(h);return m instanceof Te&&ea(m)?m.getFilters():[m]})(t.where));let a=[];t.orderBy&&(a=(function(h){return h.map((m=>(function(y){return new rn(gt(y.field),(function(R){switch(R){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(y.direction))})(m)))})(t.orderBy));let o=null;t.limit&&(o=(function(h){let m;return m=typeof h=="object"?h.value:h,Hn(m)?null:m})(t.limit));let u=null;t.startAt&&(u=(function(h){const m=!!h.before,g=h.values||[];return new qn(g,m)})(t.startAt));let c=null;return t.endAt&&(c=(function(h){const m=!h.before,g=h.values||[];return new qn(g,m)})(t.endAt)),bu(e,s,a,i,o,"F",u,c)}function sc(n,e){const t=(function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return V(28987,{purpose:s})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function ic(n,e){return{structuredPipeline:{pipeline:{stages:e.stages.map((t=>t._toProto(n)))}}}}function ya(n){return n.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const r=gt(t.unaryFilter.field);return B.create(r,"==",{doubleValue:NaN});case"IS_NULL":const s=gt(t.unaryFilter.field);return B.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=gt(t.unaryFilter.field);return B.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=gt(t.unaryFilter.field);return B.create(a,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return V(61313);default:return V(60726)}})(n):n.fieldFilter!==void 0?(function(t){return B.create(gt(t.fieldFilter.field),(function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return V(58110);default:return V(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(n):n.compositeFilter!==void 0?(function(t){return Te.create(t.compositeFilter.filters.map((r=>ya(r))),(function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return V(1026)}})(t.compositeFilter.op))})(n):V(30097,{filter:n})}function ac(n){return Wu[n]}function oc(n){return Ku[n]}function uc(n){return Hu[n]}function pt(n){return{fieldPath:n.canonicalString()}}function gt(n){return me.fromServerFormat(n.fieldPath)}function Ta(n){return n instanceof B?(function(t){if(t.op==="=="){if(ue(t.value))return{unaryFilter:{field:pt(t.field),op:"IS_NAN"}};if(de(t.value))return{unaryFilter:{field:pt(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(ue(t.value))return{unaryFilter:{field:pt(t.field),op:"IS_NOT_NAN"}};if(de(t.value))return{unaryFilter:{field:pt(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:pt(t.field),op:oc(t.op),value:t.value}}})(n):n instanceof Te?(function(t){const r=t.getFilters().map((s=>Ta(s)));return r.length===1?r[0]:{compositeFilter:{op:uc(t.op),filters:r}}})(n):V(54877,{filter:n})}function cc(n){const e=[];return n.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function Ea(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}function wa(n){return!!n&&typeof n._toProto=="function"&&n._protoValueType==="ProtoValue"}function an(n,e){const t={fields:{}};return e.forEach(((r,s)=>{if(typeof s!="string")throw new Error(`Cannot encode map with non-string key: ${s}`);t.fields[s]=r._toProto(n)})),{mapValue:t}}function Ia(n){return{stringValue:n}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tr(n){return new Yu(n,!0)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pe{constructor(e){this._byteString=e}static fromBase64String(e){try{return new pe(G.fromBase64String(e))}catch(t){throw new E(_.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new pe(G.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:pe._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(mn(e,pe._jsonSchema))return pe.fromBase64String(e.bytes)}}pe._jsonSchemaVersion="firestore/bytes/1.0",pe._jsonSchema={type:$("string",pe._jsonSchemaVersion),bytes:$("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nr{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new E(_.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new me(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}function lc(){return new nr(we)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rs{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ve{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new E(_.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new E(_.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return b(this._lat,e._lat)||b(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:ve._jsonSchemaVersion}}static fromJSON(e){if(mn(e,ve._jsonSchema))return new ve(e.latitude,e.longitude)}}ve._jsonSchemaVersion="firestore/geoPoint/1.0",ve._jsonSchema={type:$("string",ve._jsonSchemaVersion),latitude:$("number"),longitude:$("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class X{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}X.UNAUTHENTICATED=new X(null),X.GOOGLE_CREDENTIALS=new X("google-credentials-uid"),X.FIRST_PARTY=new X("first-party-uid"),X.MOCK_USER=new X("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ne{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Aa{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class hc{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(X.UNAUTHENTICATED)))}shutdown(){}}class dc{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class mc{constructor(e){this.De=e,this.currentUser=X.UNAUTHENTICATED,this.xe=0,this.forceRefresh=!1,this.auth=null}start(e,t){I(this.Ce===void 0,42304);let r=this.xe;const s=u=>this.xe!==r?(r=this.xe,t(u)):Promise.resolve();let i=new Ne;this.Ce=()=>{this.xe++,this.currentUser=this.Fe(),i.resolve(),i=new Ne,e.enqueueRetryable((()=>s(this.currentUser)))};const a=()=>{const u=i;e.enqueueRetryable((async()=>{await u.promise,await s(this.currentUser)}))},o=u=>{w("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.Ce&&(this.auth.addAuthTokenListener(this.Ce),a())};this.De.onInit((u=>o(u))),setTimeout((()=>{if(!this.auth){const u=this.De.getImmediate({optional:!0});u?o(u):(w("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new Ne)}}),0),a()}getToken(){const e=this.xe,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((r=>this.xe!==e?(w("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(I(typeof r.accessToken=="string",31837,{Oe:r}),new Aa(r.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.Ce&&this.auth.removeAuthTokenListener(this.Ce),this.Ce=void 0}Fe(){const e=this.auth&&this.auth.getUid();return I(e===null||typeof e=="string",2055,{Me:e}),new X(e)}}class fc{constructor(e,t,r){this.Ne=e,this.Le=t,this.Be=r,this.type="FirstParty",this.user=X.FIRST_PARTY,this.Ue=new Map}ke(){return this.Be?this.Be():null}get headers(){this.Ue.set("X-Goog-AuthUser",this.Ne);const e=this.ke();return e&&this.Ue.set("Authorization",e),this.Le&&this.Ue.set("X-Goog-Iam-Authorization-Token",this.Le),this.Ue}}class _c{constructor(e,t,r){this.Ne=e,this.Le=t,this.Be=r}getToken(){return Promise.resolve(new fc(this.Ne,this.Le,this.Be))}start(e,t){e.enqueueRetryable((()=>t(X.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class ai{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class pc{constructor(e,t){this.qe=t,this.forceRefresh=!1,this.appCheck=null,this.$e=null,this.Ke=null,No(e)&&e.settings.appCheckToken&&(this.Ke=e.settings.appCheckToken)}start(e,t){I(this.Ce===void 0,3512);const r=i=>{i.error!=null&&w("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const a=i.token!==this.$e;return this.$e=i.token,w("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?t(i.token):Promise.resolve()};this.Ce=i=>{e.enqueueRetryable((()=>r(i)))};const s=i=>{w("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.Ce&&this.appCheck.addTokenListener(this.Ce)};this.qe.onInit((i=>s(i))),setTimeout((()=>{if(!this.appCheck){const i=this.qe.getImmediate({optional:!0});i?s(i):w("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.Ke)return Promise.resolve(new ai(this.Ke));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(I(typeof t.token=="string",44558,{tokenResult:t}),this.$e=t.token,new ai(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.Ce&&this.appCheck.removeTokenListener(this.Ce),this.Ce=void 0}}function Va(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gc{Qe(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oi="ConnectivityMonitor";class ui{constructor(){this.We=()=>this.Ge(),this.ze=()=>this.je(),this.He=[],this.Je()}Qe(e){this.He.push(e)}shutdown(){window.removeEventListener("online",this.We),window.removeEventListener("offline",this.ze)}Je(){window.addEventListener("online",this.We),window.addEventListener("offline",this.ze)}Ge(){w(oi,"Network connectivity changed: AVAILABLE");for(const e of this.He)e(0)}je(){w(oi,"Network connectivity changed: UNAVAILABLE");for(const e of this.He)e(1)}static Ye(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let vn=null;function Mr(){return vn===null?vn=(function(){return 268435456+Math.round(2147483648*Math.random())})():vn++,"0x"+vn.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ir="RestConnection",yc={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"};class Tc{get Ze(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Xe=t+"://"+e.host,this.et=`projects/${r}/databases/${s}`,this.tt=this.databaseId.database===kn?`project_id=${r}`:`project_id=${r}&database_id=${s}`}nt(e,t,r,s,i){const a=Mr(),o=this.rt(e,t.toUriEncodedString());w(Ir,`Sending RPC '${e}' ${a}:`,o,r);const u={"google-cloud-resource-prefix":this.et,"x-goog-request-params":this.tt};this.it(u,s,i);const{host:c}=new URL(o),l=ki(c);return this.st(e,o,u,r,l).then((h=>(w(Ir,`Received RPC '${e}' ${a}: `,h),h)),(h=>{throw ye(Ir,`RPC '${e}' ${a} failed with error: `,h,"url: ",o,"request:",r),h}))}_t(e,t,r,s,i,a){return this.nt(e,t,r,s,i)}it(e,t,r){if(e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+Rt})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((s,i)=>e[i]=s)),r&&r.headers.forEach(((s,i)=>e[i]=s)),this.databaseInfo._customHeaders)for(const s of Object.keys(this.databaseInfo._customHeaders))e[s]=this.databaseInfo._customHeaders[s]}rt(e,t){const r=yc[e];let s=`${this.Xe}/v1/${t}:${r}`;return this.databaseInfo.apiKey&&(s=`${s}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),s}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ec{constructor(e){this.ot=e.ot,this.ut=e.ut}ct(e){this.lt=e}Et(e){this.ht=e}Tt(e){this.Pt=e}onMessage(e){this.It=e}close(){this.ut()}send(e){this.ot(e)}Rt(){this.lt()}At(){this.ht()}Vt(e){this.Pt(e)}dt(e){this.It(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const J="WebChannelConnection",Ut=(n,e,t)=>{n.listen(e,(r=>{try{t(r)}catch(s){setTimeout((()=>{throw s}),0)}}))};class yt extends Tc{constructor(e){super(e),this.ft=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}static gt(){if(!yt.yt){const e=zo();Ut(e,Go.STAT_EVENT,(t=>{t.stat===Ms.PROXY?w(J,"STAT_EVENT: detected buffering proxy"):t.stat===Ms.NOPROXY&&w(J,"STAT_EVENT: detected no buffering proxy")})),yt.yt=!0}}st(e,t,r,s,i){const a=Mr();return new Promise(((o,u)=>{const c=new Qo;c.setWithCredentials(!0),c.listenOnce(jo.COMPLETE,(()=>{try{switch(c.getLastErrorCode()){case Tr.NO_ERROR:const h=c.getResponseJson();w(J,`XHR for RPC '${e}' ${a} received:`,JSON.stringify(h)),o(h);break;case Tr.TIMEOUT:w(J,`RPC '${e}' ${a} timed out`),u(new E(_.DEADLINE_EXCEEDED,"Request time out"));break;case Tr.HTTP_ERROR:const m=c.getStatus();if(w(J,`RPC '${e}' ${a} failed with status:`,m,"response text:",c.getResponseText()),m>0){let g=c.getResponseJson();Array.isArray(g)&&(g=g[0]);const y=g==null?void 0:g.error;if(y&&y.status&&y.message){const S=(function(L){const U=L.toLowerCase().replace(/_/g,"-");return Object.values(_).indexOf(U)>=0?U:_.UNKNOWN})(y.status);u(new E(S,y.message))}else u(new E(_.UNKNOWN,"Server responded with status "+c.getStatus()))}else u(new E(_.UNAVAILABLE,"Connection failed."));break;default:V(9055,{wt:e,streamId:a,bt:c.getLastErrorCode(),St:c.getLastError()})}}finally{w(J,`RPC '${e}' ${a} completed.`)}}));const l=JSON.stringify(s);w(J,`RPC '${e}' ${a} sending request:`,s),c.send(t,"POST",l,r,15)}))}vt(e,t,r){const s=Mr(),i=[this.Xe,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=this.createWebChannelTransport(),o={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},u=this.longPollingOptions.timeoutSeconds;u!==void 0&&(o.longPollingTimeout=Math.round(1e3*u)),this.useFetchStreams&&(o.useFetchStreams=!0),this.it(o.initMessageHeaders,t,r),o.encodeInitMessageHeaders=!0;const c=i.join("");w(J,`Creating RPC '${e}' stream ${s}: ${c}`,o);const l=a.createWebChannel(c,o);this.Dt(l);let h=!1,m=!1;const g=new Ec({ot:y=>{m?w(J,`Not sending because RPC '${e}' stream ${s} is closed:`,y):(h||(w(J,`Opening RPC '${e}' stream ${s} transport.`),l.open(),h=!0),w(J,`RPC '${e}' stream ${s} sending:`,y),l.send(y))},ut:()=>l.close()});return Ut(l,wn.EventType.OPEN,(()=>{m||(w(J,`RPC '${e}' stream ${s} transport opened.`),g.Rt())})),Ut(l,wn.EventType.CLOSE,(()=>{m||(m=!0,w(J,`RPC '${e}' stream ${s} transport closed`),g.Vt(),this.xt(l))})),Ut(l,wn.EventType.ERROR,(y=>{m||(m=!0,ye(J,`RPC '${e}' stream ${s} transport errored. Name:`,y.name,"Message:",y.message),g.Vt(new E(_.UNAVAILABLE,"The operation could not be completed")))})),Ut(l,wn.EventType.MESSAGE,(y=>{var S;if(!m){const R=y.data[0];I(!!R,16349);const L=R,U=(L==null?void 0:L.error)||((S=L[0])==null?void 0:S.error);if(U){w(J,`RPC '${e}' stream ${s} received error:`,U);const ce=U.status;let Ot=(function(yr){const Os=q[yr];if(Os!==void 0)return ua(Os)})(ce),et=U.message;ce==="NOT_FOUND"&&et.includes("database")&&et.includes("does not exist")&&et.includes(this.databaseId.database)&&ye(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),Ot===void 0&&(Ot=_.INTERNAL,et="Unknown error status: "+ce+" with message "+U.message),m=!0,g.Vt(new E(Ot,et)),l.close()}else w(J,`RPC '${e}' stream ${s} received:`,R),g.dt(R)}})),yt.gt(),setTimeout((()=>{g.At()}),0),g}terminate(){this.ft.forEach((e=>e.close())),this.ft=[]}Dt(e){this.ft.push(e)}xt(e){this.ft=this.ft.filter((t=>t===e))}it(e,t,r){super.it(e,t,r),this.databaseInfo.apiKey&&(e["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return Wo()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wc(n){return new yt(n)}yt.yt=!1;class va{constructor(e,t,r=1e3,s=1.5,i=6e4){this.Ct=e,this.timerId=t,this.Ft=r,this.Ot=s,this.Mt=i,this.Nt=0,this.Lt=null,this.Bt=Date.now(),this.reset()}reset(){this.Nt=0}Ut(){this.Nt=this.Mt}kt(e){this.cancel();const t=Math.floor(this.Nt+this.qt()),r=Math.max(0,Date.now()-this.Bt),s=Math.max(0,t-r);s>0&&w("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.Nt} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.Lt=this.Ct.enqueueAfterDelay(this.timerId,s,(()=>(this.Bt=Date.now(),e()))),this.Nt*=this.Ot,this.Nt<this.Ft&&(this.Nt=this.Ft),this.Nt>this.Mt&&(this.Nt=this.Mt)}$t(){this.Lt!==null&&(this.Lt.skipDelay(),this.Lt=null)}cancel(){this.Lt!==null&&(this.Lt.cancel(),this.Lt=null)}qt(){return(Math.random()-.5)*this.Nt}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ci="PersistentStream";class Ra{constructor(e,t,r,s,i,a,o,u){this.Ct=e,this.Kt=r,this.Qt=s,this.connection=i,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=o,this.listener=u,this.state=0,this.Wt=0,this.Gt=null,this.zt=null,this.stream=null,this.jt=0,this.Ht=new va(e,t)}Jt(){return this.state===1||this.state===5||this.Yt()}Yt(){return this.state===2||this.state===3}start(){this.jt=0,this.state!==4?this.auth():this.Zt()}async stop(){this.Jt()&&await this.close(0)}Xt(){this.state=0,this.Ht.reset()}en(){this.Yt()&&this.Gt===null&&(this.Gt=this.Ct.enqueueAfterDelay(this.Kt,6e4,(()=>this.tn())))}nn(e){this.rn(),this.stream.send(e)}async tn(){if(this.Yt())return this.close(0)}rn(){this.Gt&&(this.Gt.cancel(),this.Gt=null)}sn(){this.zt&&(this.zt.cancel(),this.zt=null)}async close(e,t){this.rn(),this.sn(),this.Ht.cancel(),this.Wt++,e!==4?this.Ht.reset():t&&t.code===_.RESOURCE_EXHAUSTED?(ke(t.toString()),ke("Using maximum backoff delay to prevent overloading the backend."),this.Ht.Ut()):t&&t.code===_.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this._n(),this.stream.close(),this.stream=null),this.state=e,await this.listener.Tt(t)}_n(){}auth(){this.state=1;const e=this.an(this.Wt),t=this.Wt;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([r,s])=>{this.Wt===t&&this.un(r,s)}),(r=>{e((()=>{const s=new E(_.UNKNOWN,"Fetching auth token failed: "+r.message);return this.cn(s)}))}))}un(e,t){const r=this.an(this.Wt);this.stream=this.En(e,t),this.stream.ct((()=>{r((()=>this.listener.ct()))})),this.stream.Et((()=>{r((()=>(this.state=2,this.zt=this.Ct.enqueueAfterDelay(this.Qt,1e4,(()=>(this.Yt()&&(this.state=3),Promise.resolve()))),this.listener.Et())))})),this.stream.Tt((s=>{r((()=>this.cn(s)))})),this.stream.onMessage((s=>{r((()=>++this.jt==1?this.hn(s):this.onNext(s)))}))}Zt(){this.state=5,this.Ht.kt((async()=>{this.state=0,this.start()}))}cn(e){return w(ci,`close with error: ${e}`),this.stream=null,this.close(4,e)}an(e){return t=>{this.Ct.enqueueAndForget((()=>this.Wt===e?t():(w(ci,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class Ic extends Ra{constructor(e,t,r,s,i,a){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,r,s,a),this.serializer=i}En(e,t){return this.connection.vt("Listen",e,t)}hn(e){return this.onNext(e)}onNext(e){this.Ht.reset();const t=Xu(this.serializer,e),r=(function(i){if(!("targetChange"in i))return P.min();const a=i.targetChange;return a.targetIds&&a.targetIds.length?P.min():a.readTime?Ve(a.readTime):P.min()})(e);return this.listener.Tn(t,r)}Pn(e){const t={};t.database=Or(this.serializer),t.addTarget=(function(i,a){let o;const u=a.target;if(o=tt(u)?{pipelineQuery:ic(i,u)}:aa(u)?{documents:tc(i,u)}:{query:nc(i,u).Se},o.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){o.resumeToken=fa(i,a.resumeToken);const c=kr(i,a.expectedCount);c!==null&&(o.expectedCount=c)}else if(a.snapshotVersion.compareTo(P.min())>0){o.readTime=Wt(i,a.snapshotVersion.toTimestamp());const c=kr(i,a.expectedCount);c!==null&&(o.expectedCount=c)}return o})(this.serializer,e);const r=sc(this.serializer,e);r&&(t.labels=r),this.nn(t)}In(e){const t={};t.database=Or(this.serializer),t.removeTarget=e,this.nn(t)}}class Ac extends Ra{constructor(e,t,r,s,i,a){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,r,s,a),this.serializer=i}get Rn(){return this.jt>0}start(){this.lastStreamToken=void 0,super.start()}_n(){this.Rn&&this.An([])}En(e,t){return this.connection.vt("Write",e,t)}hn(e){return I(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,I(!e.writeResults||e.writeResults.length===0,55816),this.listener.Vn()}onNext(e){I(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.Ht.reset();const t=ec(e.writeResults,e.commitTime),r=Ve(e.commitTime);return this.listener.dn(r,t)}fn(){const e={};e.database=Or(this.serializer),this.nn(e)}An(e){const t={streamToken:this.lastStreamToken,writes:e.map((r=>Zu(this.serializer,r)))};this.nn(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vc{}class vc extends Vc{constructor(e,t,r,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=s,this.mn=!1}pn(){if(this.mn)throw new E(_.FAILED_PRECONDITION,"The client has already been terminated.")}nt(e,t,r,s){return this.pn(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([i,a])=>this.connection.nt(e,Lr(t,r),s,i,a))).catch((i=>{throw i.name==="FirebaseError"?(i.code===_.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new E(_.UNKNOWN,i.toString())}))}_t(e,t,r,s,i){return this.pn(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([a,o])=>this.connection._t(e,Lr(t,r),s,a,o,i))).catch((a=>{throw a.name==="FirebaseError"?(a.code===_.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new E(_.UNKNOWN,a.toString())}))}terminate(){this.mn=!0,this.connection.terminate()}}function Rc(n,e,t,r){return new vc(n,e,t,r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pc="ComponentProvider",li=new Map;function Cc(n,e,t,r,s){return new iu(n,e,t,s.host,s.ssl,s.experimentalForceLongPolling,s.experimentalAutoDetectLongPolling,Va(s.experimentalLongPollingOptions),s.useFetchStreams,s.isUsingEmulator,r,s._customHeaders,s.grpcFlowControlWindow)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hi={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},Pa=41943040;class re{static withCacheSize(e){return new re(e,re.DEFAULT_COLLECTION_PERCENTILE,re.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,r){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=r}}re.DEFAULT_COLLECTION_PERCENTILE=10,re.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,re.DEFAULT=new re(Pa,re.DEFAULT_COLLECTION_PERCENTILE,re.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),re.DISABLED=new re(-1,0,0);/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rr{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=r=>this.gn(r),this.yn=r=>t.writeSequenceNumber(r))}gn(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.yn&&this.yn(e),e}}rr.wn=-1;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sc="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class xc{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ct(n){if(n.code!==_.FAILED_PRECONDITION||n.message!==Sc)throw n;w("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class p{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&V(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new p(((r,s)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(r,s)},this.catchCallback=i=>{this.wrapFailure(t,i).next(r,s)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof p?t:p.resolve(t)}catch(t){return p.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):p.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):p.reject(t)}static resolve(e){return new p(((t,r)=>{t(e)}))}static reject(e){return new p(((t,r)=>{r(e)}))}static waitFor(e){return new p(((t,r)=>{let s=0,i=0,a=!1;e.forEach((o=>{++s,o.next((()=>{++i,a&&i===s&&t()}),(u=>r(u)))})),a=!0,i===s&&t()}))}static or(e){let t=p.resolve(!1);for(const r of e)t=t.next((s=>s?p.resolve(s):r()));return t}static forEach(e,t){const r=[];return e.forEach(((s,i)=>{r.push(t.call(this,s,i))})),this.waitFor(r)}static mapArray(e,t){return new p(((r,s)=>{const i=e.length,a=new Array(i);let o=0;for(let u=0;u<i;u++){const c=u;t(e[c]).next((l=>{a[c]=l,++o,o===i&&r(a)}),(l=>s(l)))}}))}static doWhile(e,t){return new p(((r,s)=>{const i=()=>{e()===!0?t().next((()=>{i()}),s):r()};i()}))}}function bc(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function St(n){return n.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const di="LruGarbageCollector",Nc=1048576;function mi([n,e],[t,r]){const s=b(n,t);return s===0?b(e,r):s}class Dc{constructor(e){this.Yn=e,this.buffer=new z(mi),this.Zn=0}Xn(){return++this.Zn}er(e){const t=[e,this.Xn()];if(this.buffer.size<this.Yn)this.buffer=this.buffer.add(t);else{const r=this.buffer.last();mi(t,r)<0&&(this.buffer=this.buffer.delete(r).add(t))}}get maxValue(){return this.buffer.last()[0]}}class kc{constructor(e,t,r){this.garbageCollector=e,this.asyncQueue=t,this.localStore=r,this.tr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.nr(6e4)}stop(){this.tr&&(this.tr.cancel(),this.tr=null)}get started(){return this.tr!==null}nr(e){w(di,`Garbage collection scheduled in ${e}ms`),this.tr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.tr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){St(t)?w(di,"Ignoring IndexedDB error during garbage collection: ",t):await Ct(t)}await this.nr(3e5)}))}}class Lc{constructor(e,t){this.rr=e,this.params=t}calculateTargetCount(e,t){return this.rr.ir(e).next((r=>Math.floor(t/100*r)))}nthSequenceNumber(e,t){if(t===0)return p.resolve(rr.wn);const r=new Dc(t);return this.rr.forEachTarget(e,(s=>r.er(s.sequenceNumber))).next((()=>this.rr.sr(e,(s=>r.er(s))))).next((()=>r.maxValue))}removeTargets(e,t,r){return this.rr.removeTargets(e,t,r)}removeOrphanedDocuments(e,t){return this.rr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(w("LruGarbageCollector","Garbage collection skipped; disabled"),p.resolve(hi)):this.getCacheSize(e).next((r=>r<this.params.cacheSizeCollectionThreshold?(w("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),hi):this._r(e,t)))}getCacheSize(e){return this.rr.getCacheSize(e)}_r(e,t){let r,s,i,a,o,u,c;const l=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((h=>(h>this.params.maximumSequenceNumbersToCollect?(w("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${h}`),s=this.params.maximumSequenceNumbersToCollect):s=h,a=Date.now(),this.nthSequenceNumber(e,s)))).next((h=>(r=h,o=Date.now(),this.removeTargets(e,r,t)))).next((h=>(i=h,u=Date.now(),this.removeOrphanedDocuments(e,r)))).next((h=>(c=Date.now(),mt()<=Se.DEBUG&&w("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${a-l}ms
	Determined least recently used ${s} in `+(o-a)+`ms
	Removed ${i} targets in `+(u-o)+`ms
	Removed ${h} documents in `+(c-u)+`ms
Total Duration: ${c-l}ms`),p.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:i,documentsRemoved:h}))))}}function Oc(n,e){return new Lc(n,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ca="firestore.googleapis.com",fi=!0;class _i{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new E(_.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Ca,this.ssl=fi}else this.host=e.host,this.ssl=e.ssl??fi;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e._customHeaders&&(this._customHeaders={...e._customHeaders}),e.cacheSizeBytes===void 0)this.cacheSizeBytes=Pa;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<Nc)throw new E(_.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}if(ru("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Va(e.experimentalLongPollingOptions??{}),(function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new E(_.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new E(_.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new E(_.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams,e.grpcFlowControlWindow!==void 0){if(typeof e.grpcFlowControlWindow!="number"||e.grpcFlowControlWindow<=0||e.grpcFlowControlWindow>2147483647||!Number.isInteger(e.grpcFlowControlWindow))throw new E(_.INVALID_ARGUMENT,"grpcFlowControlWindow must be a positive integer and cannot exceed 2147483647");this.grpcFlowControlWindow=e.grpcFlowControlWindow}}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(r,s){return r.timeoutSeconds===s.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams&&this.grpcFlowControlWindow===e.grpcFlowControlWindow&&(function(r,s){if(r===s)return!0;if(!r||!s)return!1;const i=Object.keys(r),a=Object.keys(s);if(i.length!==a.length)return!1;for(const o of i)if(r[o]!==s[o])return!1;return!0})(this._customHeaders,e._customHeaders)}}let sr=class{constructor(e,t,r,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new _i({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new E(_.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new E(_.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new _i(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(r){if(!r)return new hc;switch(r.type){case"firstParty":return new _c(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new E(_.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const r=li.get(t);r&&(w(Pc,"Removing Datastore"),li.delete(t),r.terminate())})(this),Promise.resolve()}};function Mc(n,e,t,r={}){var c;n=Le(n,sr);const s=ki(e),i=n._getSettings(),a={...i,emulatorOptions:n._getEmulatorOptions()},o=`${e}:${t}`;s&&Mo(`https://${o}`),i.host!==Ca&&i.host!==o&&ye("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const u={...i,host:o,ssl:s,emulatorOptions:r};if(!Uo(u,a)&&(n._setSettings(u),r.mockUserToken)){let l,h;if(typeof r.mockUserToken=="string")l=r.mockUserToken,h=X.MOCK_USER;else{l=Fo(r.mockUserToken,(c=n._app)==null?void 0:c.options.projectId);const m=r.mockUserToken.sub||r.mockUserToken.user_id;if(!m)throw new E(_.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");h=new X(m)}n._authCredentials=new dc(new Aa(l,h))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lt{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new lt(this.firestore,e,this._query)}}class F{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Ue(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new F(this.firestore,e,this._key)}toJSON(){return{type:F._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,r){if(mn(t,F._jsonSchema))return new F(e,r||null,new A(D.fromString(t.referencePath)))}}F._jsonSchemaVersion="firestore/documentReference/1.0",F._jsonSchema={type:$("string",F._jsonSchemaVersion),referencePath:$("string")};class Ue extends lt{constructor(e,t,r){super(e,t,Xr(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new F(this.firestore,null,new A(e))}withConverter(e){return new Ue(this.firestore,e,this._path)}}function Yd(n,e,...t){if(n=Re(n),Mi("collection","path",e),n instanceof sr){const r=D.fromString(e,...t);return Bs(r),new Ue(n,null,r)}{if(!(n instanceof F||n instanceof Ue))throw new E(_.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(D.fromString(e,...t));return Bs(r),new Ue(n.firestore,null,r)}}function Jd(n,e,...t){if(n=Re(n),arguments.length===1&&(e=Wr.newId()),Mi("doc","path",e),n instanceof sr){const r=D.fromString(e,...t);return qs(r),new F(n,null,new A(r))}{if(!(n instanceof F||n instanceof Ue))throw new E(_.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(D.fromString(e,...t));return qs(r),new F(n.firestore,n instanceof Ue?n.converter:null,new A(r))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ie{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(r,s){if(r.length!==s.length)return!1;for(let i=0;i<r.length;++i)if(r[i]!==s[i])return!1;return!0})(this._values,e._values)}toJSON(){return{type:ie._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(mn(e,ie._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new ie(e.vectorValues);throw new E(_.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}ie._jsonSchemaVersion="firestore/vectorValue/1.0",ie._jsonSchema={type:$("string",ie._jsonSchemaVersion),vectorValues:$("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Uc=/^__.*__$/;class Fc{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return this.fieldMask!==null?new Ze(e,this.data,this.fieldMask,t,this.fieldTransforms):new _n(e,this.data,t,this.fieldTransforms)}}class Sa{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return new Ze(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function xa(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw V(40011,{dataSource:n})}}class ss{constructor(e,t,r,s,i,a){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=s,i===void 0&&this.validatePath(),this.fieldTransforms=i||[],this.fieldMask=a||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}contextWith(e){return new ss({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}childContextForField(e){var s;const t=(s=this.path)==null?void 0:s.child(e),r=this.contextWith({path:t,arrayElement:!1});return r.validatePathSegment(e),r}childContextForFieldPath(e){var s;const t=(s=this.path)==null?void 0:s.child(e),r=this.contextWith({path:t,arrayElement:!1});return r.validatePath(),r}childContextForArray(e){return this.contextWith({path:void 0,arrayElement:!0})}createError(e){return $n(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}validatePath(){if(this.path)for(let e=0;e<this.path.length;e++)this.validatePathSegment(this.path.get(e))}validatePathSegment(e){if(e.length===0)throw this.createError("Document fields must not be empty");if(xa(this.dataSource)&&Uc.test(e))throw this.createError('Document fields cannot begin and end with "__"')}}class qc{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||tr(e)}createContext(e,t,r,s=!1){return new ss({dataSource:e,methodName:t,targetDoc:r,path:me.emptyPath(),arrayElement:!1,hasConverter:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function is(n){const e=n._freezeSettings(),t=tr(n._databaseId);return new qc(n._databaseId,!!e.ignoreUndefinedProperties,t)}function ba(n,e,t,r,s,i={}){const a=n.createContext(i.merge||i.mergeFields?2:0,e,t,s);as("Data must be an object, but it was:",a,r);const o=Na(r,a);let u,c;if(i.merge)u=new he(a.fieldMask),c=a.fieldTransforms;else if(i.mergeFields){const l=[];for(const h of i.mergeFields){const m=je(e,h,t);if(!a.contains(m))throw new E(_.INVALID_ARGUMENT,`Field '${m}' is specified in your field mask but missing from your input data.`);Oa(l,m)||l.push(m)}u=new he(l),c=a.fieldTransforms.filter((h=>u.covers(h.field)))}else u=null,c=a.fieldTransforms;return new Fc(new ne(o),u,c)}class ir extends rs{_toFieldTransform(e){if(e.dataSource!==2)throw e.dataSource===1?e.createError(`${this._methodName}() can only appear at the top level of your update data`):e.createError(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof ir}}function Bc(n,e,t,r){const s=n.createContext(1,e,t);as("Data must be an object, but it was:",s,r);const i=[],a=ne.empty();Xe(r,((u,c)=>{const l=La(e,u,t);c=Re(c);const h=s.childContextForFieldPath(l);if(c instanceof ir)i.push(l);else{const m=Qe(c,h);m!=null&&(i.push(l),a.set(l,m))}}));const o=new he(i);return new Sa(a,o,s.fieldTransforms)}function $c(n,e,t,r,s,i){const a=n.createContext(1,e,t),o=[je(e,r,t)],u=[s];if(i.length%2!=0)throw new E(_.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let m=0;m<i.length;m+=2)o.push(je(e,i[m])),u.push(i[m+1]);const c=[],l=ne.empty();for(let m=o.length-1;m>=0;--m)if(!Oa(c,o[m])){const g=o[m];let y=u[m];y=Re(y);const S=a.childContextForFieldPath(g);if(y instanceof ir)c.push(g);else{const R=Qe(y,S);R!=null&&(c.push(g),l.set(g,R))}}const h=new he(c);return new Sa(l,h,a.fieldTransforms)}function zc(n,e,t,r=!1){return Qe(t,n.createContext(r?4:3,e))}function Qe(n,e,t){if(ka(n=Re(n)))return as("Unsupported field value:",e,n),Na(n,e);if(n instanceof rs)return(function(s,i){if(!xa(i.dataSource))throw i.createError(`${s._methodName}() can only be used with update() and set()`);if(!i.path)throw i.createError(`${s._methodName}() is not currently supported inside arrays`);const a=s._toFieldTransform(i);a&&i.fieldTransforms.push(a)})(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.arrayElement&&e.dataSource!==4)throw e.createError("Nested arrays are not supported");return(function(s,i){const a=[];let o=0;for(const u of s){let c=Qe(u,i.childContextForArray(o));c==null&&(c={nullValue:"NULL_VALUE"}),a.push(c),o++}return{arrayValue:{values:a}}})(n,e)}return(function(s,i,a){if((s=Re(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return Yr(i.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const o=k.fromDate(s);return{timestampValue:Wt(i.serializer,o)}}if(s instanceof k){const o=new k(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:Wt(i.serializer,o)}}if(Da(s)){const o=k.fromInstant(s),u=new k(o.seconds,1e3*Math.floor(o.nanoseconds/1e3));return{timestampValue:Wt(i.serializer,u)}}if(s instanceof ve)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof pe)return{bytesValue:fa(i.serializer,s._byteString)};if(s instanceof F){const o=i.databaseId,u=s.firestore._databaseId;if(!u.isEqual(o))throw i.createError(`Document reference is for database ${u.projectId}/${u.database} but should be for database ${o.projectId}/${o.database}`);return{referenceValue:ns(s.firestore._databaseId||i.databaseId,s._key.path)}}if(s instanceof ie)return(function(u,c){const l=u instanceof ie?u.toArray():u;return{mapValue:{fields:{[zi]:{stringValue:Gi},[Xt]:{arrayValue:{values:l.map((m=>{if(typeof m!="number")throw c.createError("VectorValues must only contain numeric values.");return Yn(c.serializer,m)}))}}}}}})(s,i);if(wa(s))return s._toProto(i.serializer);throw i.createError(`Unsupported field value: ${Wn(s)}`)})(n,e)}function Na(n,e){const t={};return Oi(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Xe(n,((r,s)=>{const i=Qe(s,e.childContextForField(r));i!=null&&(t[r]=i)})),{mapValue:{fields:t}}}function Da(n){if(typeof n!="object"||n===null)return!1;if(typeof Temporal<"u"&&typeof Temporal.Instant=="function"&&n instanceof Temporal.Instant)return!0;const e=n;return e[Symbol.toStringTag]==="Temporal.Instant"&&typeof e.t=="bigint"}function ka(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof k||n instanceof ve||n instanceof pe||n instanceof F||n instanceof rs||n instanceof ie||Da(n)||wa(n))}function as(n,e,t){if(!ka(t)||!dn(t)){const r=Wn(t);throw r==="an object"?e.createError(n+" a custom object"):e.createError(n+" "+r)}}function je(n,e,t){if((e=Re(e))instanceof nr)return e._internalPath;if(typeof e=="string")return La(n,e);throw $n("Field path arguments must be of type string or ",n,!1,void 0,t)}const Gc=new RegExp("[~\\*/\\[\\]]");function La(n,e,t){if(e.search(Gc)>=0)throw $n(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new nr(...e.split("."))._internalPath}catch{throw $n(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function $n(n,e,t,r,s){const i=r&&!r.isEmpty(),a=s!==void 0;let o=`Function ${e}() called with invalid data`;t&&(o+=" (via `toFirestore()`)"),o+=". ";let u="";return(i||a)&&(u+=" (found",i&&(u+=` in field ${r}`),a&&(u+=` in document ${s}`),u+=")"),new E(_.INVALID_ARGUMENT,o+n+u)}function Oa(n,e){return n.some((t=>t.isEqual(e)))}function Ma(n){return typeof n._readUserData=="function"}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ee{constructor(e){this.optionDefinitions=e}_getKnownOptions(e,t){const r=ne.empty();for(const s in this.optionDefinitions)if(this.optionDefinitions.hasOwnProperty(s)){const i=this.optionDefinitions[s];if(s in e){const a=e[s];let o;i.nestedOptions&&dn(a)?o={mapValue:{fields:new ee(i.nestedOptions).getOptionsProto(t,a)}}:a&&(o=Qe(a,t)??void 0),o&&r.set(me.fromServerFormat(i.serverName),o)}}return r}getOptionsProto(e,t,r){const s=this._getKnownOptions(t,e);if(r){const i=new Map(nu(r,((a,o)=>[me.fromServerFormat(o),a!==void 0?Qe(a,e):null])));s.setAll(i)}return s.value.mapValue.fields??{}}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qc(n){return typeof n=="object"&&n!==null&&!!("nullValue"in n&&(n.nullValue===null||n.nullValue==="NULL_VALUE")||"booleanValue"in n&&(n.booleanValue===null||typeof n.booleanValue=="boolean")||"integerValue"in n&&(n.integerValue===null||typeof n.integerValue=="number"||typeof n.integerValue=="string")||"doubleValue"in n&&(n.doubleValue===null||typeof n.doubleValue=="number")||"timestampValue"in n&&(n.timestampValue===null||(function(t){return typeof t=="object"&&t!==null&&"seconds"in t&&(t.seconds===null||typeof t.seconds=="number"||typeof t.seconds=="string")&&"nanos"in t&&(t.nanos===null||typeof t.nanos=="number")})(n.timestampValue))||"stringValue"in n&&(n.stringValue===null||typeof n.stringValue=="string")||"bytesValue"in n&&(n.bytesValue===null||n.bytesValue instanceof Uint8Array)||"referenceValue"in n&&(n.referenceValue===null||typeof n.referenceValue=="string")||"geoPointValue"in n&&(n.geoPointValue===null||(function(t){return typeof t=="object"&&t!==null&&"latitude"in t&&(t.latitude===null||typeof t.latitude=="number")&&"longitude"in t&&(t.longitude===null||typeof t.longitude=="number")})(n.geoPointValue))||"arrayValue"in n&&(n.arrayValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("values"in t)||t.values!==null&&!Array.isArray(t.values))})(n.arrayValue))||"mapValue"in n&&(n.mapValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("fields"in t)||t.fields!==null&&!dn(t.fields))})(n.mapValue))||"fieldReferenceValue"in n&&(n.fieldReferenceValue===null||typeof n.fieldReferenceValue=="string")||"functionValue"in n&&(n.functionValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("name"in t)||t.name!==null&&typeof t.name!="string"||!("args"in t)||t.args!==null&&!Array.isArray(t.args))})(n.functionValue))||"pipelineValue"in n&&(n.pipelineValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("stages"in t)||t.stages!==null&&!Array.isArray(t.stages))})(n.pipelineValue)))}function jc(n){return new ie(n)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function T(n){let e;return n instanceof ht?n:(e=dn(n)?Jc(n):n instanceof Array?Xc(n):Ua(n,void 0),e)}function Ar(n){if(n instanceof ht)return n;if(n instanceof ie)return on(n);if(Array.isArray(n))return on(jc(n));throw new Error("Unsupported value: "+typeof n)}function os(n){return uu(n)?bn(n):T(n)}class ht{constructor(){this._protoValueType="ProtoValue"}add(e){return new f("add",[this,T(e)],"add")}asBoolean(){if(this instanceof We)return this;if(this instanceof bt)return new qa(this);if(this instanceof xt)return new Yc(this);if(this instanceof f)return new Fa(this);throw new E("invalid-argument",`Conversion of type ${typeof this} to BooleanExpression not supported.`)}subtract(e){return new f("subtract",[this,T(e)],"subtract")}multiply(e){return new f("multiply",[this,T(e)],"multiply")}divide(e){return new f("divide",[this,T(e)],"divide")}mod(e){return new f("mod",[this,T(e)],"mod")}equal(e){return new f("equal",[this,T(e)],"equal").asBoolean()}notEqual(e){return new f("not_equal",[this,T(e)],"notEqual").asBoolean()}lessThan(e){return new f("less_than",[this,T(e)],"lessThan").asBoolean()}lessThanOrEqual(e){return new f("less_than_or_equal",[this,T(e)],"lessThanOrEqual").asBoolean()}greaterThan(e){return new f("greater_than",[this,T(e)],"greaterThan").asBoolean()}greaterThanOrEqual(e){return new f("greater_than_or_equal",[this,T(e)],"greaterThanOrEqual").asBoolean()}arrayConcat(e,...t){const r=[e,...t].map((s=>T(s)));return new f("array_concat",[this,...r],"arrayConcat")}arrayContains(e){return new f("array_contains",[this,T(e)],"arrayContains").asBoolean()}arrayContainsAll(e){const t=Array.isArray(e)?new qt(e.map(T),"arrayContainsAll"):e;return new f("array_contains_all",[this,t],"arrayContainsAll").asBoolean()}arrayContainsAny(e){const t=Array.isArray(e)?new qt(e.map(T),"arrayContainsAny"):e;return new f("array_contains_any",[this,t],"arrayContainsAny").asBoolean()}arrayReverse(){return new f("array_reverse",[this])}arrayLength(){return new f("array_length",[this],"arrayLength")}equalAny(e){const t=Array.isArray(e)?new qt(e.map(T),"equalAny"):e;return new f("equal_any",[this,t],"equalAny").asBoolean()}notEqualAny(e){const t=Array.isArray(e)?new qt(e.map(T),"notEqualAny"):e;return new f("not_equal_any",[this,t],"notEqualAny").asBoolean()}exists(){return new f("exists",[this],"exists").asBoolean()}charLength(){return new f("char_length",[this],"charLength")}like(e){return new f("like",[this,T(e)],"like").asBoolean()}regexContains(e){return new f("regex_contains",[this,T(e)],"regexContains").asBoolean()}regexFind(e){return new f("regex_find",[this,T(e)],"regexFind")}regexFindAll(e){return new f("regex_find_all",[this,T(e)],"regexFindAll")}regexMatch(e){return new f("regex_match",[this,T(e)],"regexMatch").asBoolean()}stringContains(e){return new f("string_contains",[this,T(e)],"stringContains").asBoolean()}startsWith(e){return new f("starts_with",[this,T(e)],"startsWith").asBoolean()}endsWith(e){return new f("ends_with",[this,T(e)],"endsWith").asBoolean()}toLower(){return new f("to_lower",[this],"toLower")}toUpper(){return new f("to_upper",[this],"toUpper")}trim(e){const t=[this];return e&&t.push(T(e)),new f("trim",t,"trim")}ltrim(e){const t=[this];return e&&t.push(T(e)),new f("ltrim",t,"ltrim")}rtrim(e){const t=[this];return e&&t.push(T(e)),new f("rtrim",t,"rtrim")}type(){return new f("type",[this])}isType(e){return new f("is_type",[this,on(e)],"isType").asBoolean()}stringConcat(e,...t){const r=[e,...t].map(T);return new f("string_concat",[this,...r],"stringConcat")}stringIndexOf(e){return new f("string_index_of",[this,T(e)],"stringIndexOf")}stringRepeat(e){return new f("string_repeat",[this,T(e)],"stringRepeat")}stringReplaceAll(e,t){return new f("string_replace_all",[this,T(e),T(t)],"stringReplaceAll")}stringReplaceOne(e,t){return new f("string_replace_one",[this,T(e),T(t)],"stringReplaceOne")}concat(e,...t){const r=[e,...t].map(T);return new f("concat",[this,...r],"concat")}reverse(){return new f("reverse",[this],"reverse")}arrayFilter(e,t){return new f("array_filter",[this,T(e),t],"arrayFilter")}arrayTransform(e,t){return new f("array_transform",[this,T(e),t],"arrayTransform")}arrayTransformWithIndex(e,t,r){return new f("array_transform",[this,T(e),T(t),r],"arrayTransformWithIndex")}arraySlice(e,t){const r=[this,T(e)];return t!==void 0&&r.push(T(t)),new f("array_slice",r,"arraySlice")}arrayFirst(){return new f("array_first",[this],"arrayFirst")}arrayFirstN(e){return new f("array_first_n",[this,T(e)],"arrayFirstN")}arrayLast(){return new f("array_last",[this],"arrayLast")}arrayLastN(e){return new f("array_last_n",[this,T(e)],"arrayLastN")}arrayMaximum(){return new f("maximum",[this],"arrayMaximum")}arrayMaximumN(e){return new f("maximum_n",[this,T(e)],"arrayMaximumN")}arrayMinimum(){return new f("minimum",[this],"arrayMinimum")}arrayMinimumN(e){return new f("minimum_n",[this,T(e)],"arrayMinimumN")}arrayIndexOf(e){return new f("array_index_of",[this,T(e),T("first")],"arrayIndexOf")}arrayLastIndexOf(e){return new f("array_index_of",[this,T(e),T("last")],"arrayLastIndexOf")}arrayIndexOfAll(e){return new f("array_index_of_all",[this,T(e)],"arrayIndexOfAll")}byteLength(){return new f("byte_length",[this],"byteLength")}ceil(){return new f("ceil",[this])}floor(){return new f("floor",[this])}abs(){return new f("abs",[this])}exp(){return new f("exp",[this])}mapGet(e){return new f("map_get",[this,on(e)],"mapGet")}mapSet(e,t,...r){const s=[this,T(e),T(t),...r.map(T)];return new f("map_set",s,"mapSet")}mapKeys(){return new f("map_keys",[this],"mapKeys")}mapValues(){return new f("map_values",[this],"mapValues")}mapEntries(){return new f("map_entries",[this],"mapEntries")}getField(e){return new f("get_field",[this,T(e)],"get_field")}count(){return le._create("count",[this],"count")}sum(){return le._create("sum",[this],"sum")}average(){return le._create("average",[this],"average")}minimum(){return le._create("minimum",[this],"minimum")}maximum(){return le._create("maximum",[this],"maximum")}first(){return le._create("first",[this],"first")}last(){return le._create("last",[this],"last")}arrayAgg(){return le._create("array_agg",[this],"arrayAgg")}arrayAggDistinct(){return le._create("array_agg_distinct",[this],"arrayAggDistinct")}countDistinct(){return le._create("count_distinct",[this],"countDistinct")}logicalMaximum(e,...t){const r=[e,...t];return new f("maximum",[this,...r.map(T)],"logicalMaximum")}logicalMinimum(e,...t){const r=[e,...t];return new f("minimum",[this,...r.map(T)],"minimum")}vectorLength(){return new f("vector_length",[this],"vectorLength")}cosineDistance(e){return new f("cosine_distance",[this,Ar(e)],"cosineDistance")}dotProduct(e){return new f("dot_product",[this,Ar(e)],"dotProduct")}euclideanDistance(e){return new f("euclidean_distance",[this,Ar(e)],"euclideanDistance")}unixMicrosToTimestamp(){return new f("unix_micros_to_timestamp",[this],"unixMicrosToTimestamp")}timestampToUnixMicros(){return new f("timestamp_to_unix_micros",[this],"timestampToUnixMicros")}unixMillisToTimestamp(){return new f("unix_millis_to_timestamp",[this],"unixMillisToTimestamp")}timestampToUnixMillis(){return new f("timestamp_to_unix_millis",[this],"timestampToUnixMillis")}unixSecondsToTimestamp(){return new f("unix_seconds_to_timestamp",[this],"unixSecondsToTimestamp")}timestampToUnixSeconds(){return new f("timestamp_to_unix_seconds",[this],"timestampToUnixSeconds")}timestampAdd(e,t){return new f("timestamp_add",[this,T(e),T(t)],"timestampAdd")}timestampSubtract(e,t){return new f("timestamp_subtract",[this,T(e),T(t)],"timestampSubtract")}timestampDiff(e,t){return new f("timestamp_diff",[this,os(e),T(t)],"timestampDiff")}timestampExtract(e,t){const r=[this,T(e)];return t&&r.push(T(t)),new f("timestamp_extract",r,"timestampExtract")}documentId(){return new f("document_id",[this],"documentId")}parent(){return new f("parent",[this],"parent")}substring(e,t){const r=T(e);return new f("substring",t===void 0?[this,r]:[this,r,T(t)],"substring")}arrayGet(e){return new f("array_get",[this,T(e)],"arrayGet")}isError(){return new f("is_error",[this],"isError").asBoolean()}ifError(e){const t=new f("if_error",[this,T(e)],"ifError");return e instanceof We?t.asBoolean():t}isAbsent(){return new f("is_absent",[this],"isAbsent").asBoolean()}mapRemove(e){return new f("map_remove",[this,T(e)],"mapRemove")}mapMerge(e,...t){const r=T(e),s=t.map(T);return new f("map_merge",[this,r,...s],"mapMerge")}pow(e){return new f("pow",[this,T(e)])}trunc(e){return e===void 0?new f("trunc",[this]):new f("trunc",[this,T(e)],"trunc")}round(e){return e===void 0?new f("round",[this]):new f("round",[this,T(e)],"round")}collectionId(){return new f("collection_id",[this])}length(){return new f("length",[this])}ln(){return new f("ln",[this])}sqrt(){return new f("sqrt",[this])}stringReverse(){return new f("string_reverse",[this])}ifAbsent(e){return new f("if_absent",[this,T(e)],"ifAbsent")}ifNull(e){return new f("if_null",[this,T(e)],"ifNull")}coalesce(e,...t){return new f("coalesce",[this,T(e),...t.map(T)],"coalesce")}join(e){return new f("join",[this,T(e)],"join")}log10(){return new f("log10",[this])}arraySum(){return new f("sum",[this])}split(e){return new f("split",[this,T(e)])}timestampTruncate(e,t){const r=[this,T(e)];return t&&r.push(T(t)),new f("timestamp_trunc",r)}ascending(){return Zc(this)}descending(){return el(this)}as(e){return new Kc(this,e,"as")}}class le{constructor(e,t){this.name=e,this.params=t,this.exprType="AggregateFunction",this._protoValueType="ProtoValue"}static _create(e,t,r){const s=new le(e,t);return s._methodName=r,s}as(e){return new Wc(this,e,"as")}_toProto(e){return{functionValue:{name:this.name,args:this.params.map((t=>t._toProto(e)))}}}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,this.params.forEach((t=>t._readUserData(e)))}}class Wc{constructor(e,t,r){this.aggregate=e,this.alias=t,this._methodName=r}_readUserData(e){this.aggregate._readUserData(e)}}class Kc{constructor(e,t,r){this.expr=e,this.alias=t,this._methodName=r,this.exprType="AliasedExpression",this.selectable=!0}_readUserData(e){this.expr._readUserData(e)}}class qt extends ht{constructor(e,t){super(),this.cr=e,this._methodName=t,this.expressionType="ListOfExpressions"}_toProto(e){return{arrayValue:{values:this.cr.map((t=>t._toProto(e)))}}}_readUserData(e){this.cr.forEach((t=>t._readUserData(e)))}}class xt extends ht{constructor(e,t){super(),this.fieldPath=e,this._methodName=t,this.expressionType="Field",this.selectable=!0}get _fieldPath(){return this.fieldPath}get fieldName(){return this.fieldPath.canonicalString()}get alias(){return this.fieldName}get expr(){return this}geoDistance(e){return new f("geo_distance",[this,T(e)],"geoDistance")}_toProto(e){return{fieldReferenceValue:this.fieldPath.canonicalString()}}_readUserData(e){}}function bn(n){return Hc(n,"field")}function Hc(n,e){return new xt(typeof n=="string"?we===n?lc()._internalPath:je("field",n):n._internalPath,e)}class bt extends ht{constructor(e,t){super(),this.value=e,this._methodName=t,this.expressionType="Constant"}static _fromProto(e){const t=new bt(e,void 0);return t._protoValue=e,t}_toProto(e){return I(this._protoValue!==void 0,237),this._protoValue}_getValue(){return this._protoValue}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,Qc(this._protoValue)||(this._protoValue=Qe(this.value,e))}}function on(n,e){return Ua(n,"constant")}function Ua(n,e){const t=new bt(n,e);return typeof n=="boolean"?new qa(t):t}class f extends ht{constructor(e,t,r,s){super(),this.name=e,this.params=t,this.expressionType="Function",this._optionsProto=void 0,r!==void 0&&(this._methodName=r),s!==void 0&&(this._options=s)}get _optionsUtil(){return new ee({})}_toProto(e){const t={functionValue:{name:this.name,args:this.params.map((r=>r._toProto(e)))}};return this._optionsProto&&(t.functionValue.options=this._optionsProto),t}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,this.params.forEach((t=>t._readUserData(e))),this._options&&(this._optionsProto=this._optionsUtil.getOptionsProto(e,this._options))}}class We extends ht{get _methodName(){return this._expr._methodName}countIf(){return le._create("count_if",[this],"countIf")}not(){return new f("not",[this],"not").asBoolean()}conditional(e,t){return new f("conditional",[this,e,t],"conditional")}ifError(e){const t=T(e),r=new f("if_error",[this,t],"ifError");return t instanceof We?r.asBoolean():r}_toProto(e){return this._expr._toProto(e)}_readUserData(e){this._expr._readUserData(e)}}class Fa extends We{constructor(e){super(),this._expr=e,this.expressionType="Function"}}class qa extends We{constructor(e){super(),this._expr=e,this.expressionType="Constant"}_getValue(){return this._expr._getValue()}}class Yc extends We{constructor(e){super(),this._expr=e,this.expressionType="Field"}}function Jc(n,e){const t=[];for(const r in n)if(Object.prototype.hasOwnProperty.call(n,r)){const s=n[r];t.push(on(r)),t.push(T(s))}return new f("map",t,"map")}function Xc(n){return(function(t,r){return new f("array",t.map((s=>T(s))),r)})(n,"array")}function Zc(n){return new Ba(os(n),"ascending","ascending")}function el(n){return new Ba(os(n),"descending","descending")}class Ba{constructor(e,t,r){this.expr=e,this.direction=t,this._methodName=r,this._protoValueType="ProtoValue"}_toProto(e){return{mapValue:{fields:{direction:Ia(this.direction),expression:this.expr._toProto(e)}}}}_readUserData(e){this.expr._readUserData(e)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _e{constructor(e){this.optionsProto=void 0,{rawOptions:this.rawOptions,...this.knownOptions}=e}_readUserData(e){this.optionsProto=this._optionsUtil.getOptionsProto(e,this.knownOptions,this.rawOptions)}_toProto(e){return{name:this._name,options:this.optionsProto}}}class $a extends _e{get _name(){return"add_fields"}get _optionsUtil(){return new ee({})}constructor(e,t){super(t),this.fields=e}_toProto(e){return{...super._toProto(e),args:[an(e,this.fields)]}}_readUserData(e){super._readUserData(e),Ke(this.fields,e)}}class za extends _e{get _name(){return"aggregate"}get _optionsUtil(){return new ee({})}constructor(e,t,r){super(r),this.groups=e,this.accumulators=t}_toProto(e){return{...super._toProto(e),args:[an(e,this.accumulators),an(e,this.groups)]}}_readUserData(e){super._readUserData(e),Ke(this.groups,e),Ke(this.accumulators,e)}}class Ga extends _e{get _name(){return"distinct"}get _optionsUtil(){return new ee({})}constructor(e,t){super(t),this.groups=e}_toProto(e){return{...super._toProto(e),args:[an(e,this.groups)]}}_readUserData(e){super._readUserData(e),Ke(this.groups,e)}}class ar extends _e{get _name(){return"collection"}get _optionsUtil(){return new ee({forceIndex:{serverName:"force_index"}})}constructor(e,t){super(t),this.hr=e.startsWith("/")?e:"/"+e}_toProto(e){return{...super._toProto(e),args:[{referenceValue:this.hr}]}}_readUserData(e){super._readUserData(e)}}class or extends _e{get _name(){return"collection_group"}get _optionsUtil(){return new ee({forceIndex:{serverName:"force_index"}})}constructor(e,t){super(t),this.collectionId=e}_toProto(e){return{...super._toProto(e),args:[{referenceValue:""},{stringValue:this.collectionId}]}}_readUserData(e){super._readUserData(e)}}class us extends _e{get _name(){return"database"}get _optionsUtil(){return new ee({})}_toProto(e){return{...super._toProto(e)}}_readUserData(e){super._readUserData(e)}}class cs extends _e{get _name(){return"documents"}get _optionsUtil(){return new ee({})}constructor(e,t){if(super(t),!e||e.length===0)throw new E(_.INVALID_ARGUMENT,"Empty document paths are not allowed in DocumentsSource");const r=e.map((i=>i.startsWith("/")?i:"/"+i)),s=new Set(r);if(s.size!==r.length)throw new E(_.INVALID_ARGUMENT,"Duplicate document paths are not allowed in DocumentsSource");this.Tr=r,this.Pr=s}_toProto(e){return{...super._toProto(e),args:this.Tr.map((t=>({referenceValue:t})))}}_readUserData(e){super._readUserData(e)}}class ur extends _e{get _name(){return"where"}get _optionsUtil(){return new ee({})}constructor(e,t){super(t),this.condition=e}_toProto(e){return{...super._toProto(e),args:[this.condition._toProto(e)]}}_readUserData(e){super._readUserData(e),Ke(this.condition,e)}}class ut extends _e{get _name(){return"limit"}get _optionsUtil(){return new ee({})}constructor(e,t){I(!isNaN(e)&&e!==1/0&&e!==-1/0,34860),super(t),this.limit=e}_toProto(e){return{...super._toProto(e),args:[Yr(e,this.limit)]}}}class pi extends _e{get _name(){return"offset"}get _optionsUtil(){return new ee({})}constructor(e,t){super(t),this.offset=e}_toProto(e){return{...super._toProto(e),args:[Yr(e,this.offset)]}}}class tl extends _e{get _name(){return"select"}get _optionsUtil(){return new ee({})}constructor(e,t){super(t),this.selections=e}_toProto(e){return{...super._toProto(e),args:[an(e,this.selections)]}}_readUserData(e){super._readUserData(e),Ke(this.selections,e)}}class xe extends _e{get _name(){return"sort"}get _optionsUtil(){return new ee({})}constructor(e,t){super(t),this.orderings=e}_toProto(e){return{...super._toProto(e),args:this.orderings.map((t=>t._toProto(e)))}}_readUserData(e){super._readUserData(e),Ke(this.orderings,e)}}class ls extends _e{get _name(){return"replace_with"}get _optionsUtil(){return new ee({})}constructor(e,t){super(t),this.map=e}_toProto(e){return{...super._toProto(e),args:[this.map._toProto(e),Ia(ls.Ir)]}}_readUserData(e){super._readUserData(e),Ke(this.map,e)}}ls.Ir="full_replace";function Ke(n,e){return Ma(n)?n._readUserData(e):Array.isArray(n)?n.forEach((t=>t._readUserData(e))):n instanceof Map?n.forEach((t=>t._readUserData(e))):Object.values(n).forEach((t=>t._readUserData(e))),n}/**
 * @license
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kt{constructor(e,t,r,s){this._db=e,this.userDataReader=t,this._userDataWriter=r,this.stages=s}Vr(e,t){const r=this.userDataReader.createContext(3,e);return Ma(t)?t._readUserData(r):Array.isArray(t)?t.forEach((s=>s._readUserData(r))):t.forEach((s=>s._readUserData(r))),t}where(e){const t=this.stages.map((r=>r));return this.Vr("where",e),t.push(new ur(e,{})),new Kt(this._db,this.userDataReader,this._userDataWriter,t)}limit(e){const t=this.stages.map((r=>r));return t.push(new ut(e,{})),new Kt(this._db,this.userDataReader,this._userDataWriter,t)}sort(e,...t){const r=this.stages.map((s=>s));return"orderings"in e?r.push(new xe(this.Vr("sort",e.orderings),{})):r.push(new xe(this.Vr("sort",[e,...t]),{})),new Kt(this._db,this.userDataReader,this._userDataWriter,r)}dr(e){return{pipeline:{stages:this.stages.map((t=>t._toProto(e)))}}}}// Copyright 2024 Google LLC* @license
class te{constructor(e,t,r){this.serializer=e,this.stages=t,this.listenOptions=r,this.isCorePipeline=!0}getPipelineCollection(){return cr(this)}getPipelineCollectionGroup(){return hs(this)}getPipelineCollectionId(){return nl(this)}getPipelineDocuments(){return Ur(this)}getPipelineFlavor(){return(function(t){let r="exact";return t.stages.forEach(((s,i)=>{s._name!==Ga.name&&s._name!==za.name||(r="keyless"),s._name===tl.name&&r==="exact"&&(r="augmented"),s._name===$a.name&&i<t.stages.length-1&&r==="exact"&&(r="augmented")})),r})(this)}getPipelineSourceType(){return Fe(this)}}function Fe(n){const e=n.stages[0];return e instanceof ar||e instanceof or||e instanceof us||e instanceof cs?e._name:"unknown"}function cr(n){if(Fe(n)==="collection")return n.stages[0].hr}function hs(n){if(Fe(n)==="collection_group")return n.stages[0].collectionId}function nl(n){switch(Fe(n)){case"collection":return D.fromString(cr(n)).lastSegment();case"collection_group":return hs(n);default:return}}function Ur(n){if(Fe(n)==="documents")return n.stages[0].Tr}class d{constructor(e,t){this.type=e,this.value=t}static mr(){return new d("ERROR",void 0)}static pr(){return new d("UNSET",void 0)}static gr(){return new d("NULL",It)}static newValue(e){return de(e)?new d("NULL",It):(function(r){return!!r&&"booleanValue"in r})(e)?new d("BOOLEAN",e):Ie(e)?new d("INT",e):nt(e)?new d("DOUBLE",e):(function(r){return!!r&&"timestampValue"in r&&!!r.timestampValue})(e)?new d("TIMESTAMP",e):(function(r){return!!r&&"stringValue"in r})(e)?new d("STRING",e):(function(r){return!!r&&"bytesValue"in r})(e)?new d("BYTES",e):e.referenceValue?new d("REFERENCE",e):e.geoPointValue?new d("GEO_POINT",e):Vt(e)?new d("ARRAY",e):Ln(e)?new d("VECTOR",e):st(e)?new d("MAP",e):new d("ERROR",void 0)}yr(){return this.type==="ERROR"||this.type==="UNSET"}wr(){return this.type==="NULL"}}function Ht(n){if(!n.yr())return n.value}function Qa(n){return n instanceof We?n._expr:n}function v(n){if((n=Qa(n))instanceof xt)return new rl(n);if(n instanceof bt)return new sl(n);if(n instanceof qt)return new il(n);if(n instanceof f){if(n.name==="add")return new ul(n);if(n.name==="subtract")return new cl(n);if(n.name==="multiply")return new ll(n);if(n.name==="divide")return new hl(n);if(n.name==="mod")return new dl(n);if(n.name==="and")return new ml(n);if(n.name==="equal")return new vl(n);if(n.name==="not_equal")return new Rl(n);if(n.name==="less_than")return new Pl(n);if(n.name==="less_than_or_equal")return new Cl(n);if(n.name==="greater_than")return new Sl(n);if(n.name==="greater_than_or_equal")return new xl(n);if(n.name==="array_concat")return new bl(n);if(n.name==="array_reverse")return new Nl(n);if(n.name==="array_contains")return new Dl(n);if(n.name==="array_contains_all")return new kl(n);if(n.name==="array_contains_any")return new Ll(n);if(n.name==="array_length")return new Ol(n);if(n.name==="array_element")return new Ml(n);if(n.name==="equal_any")return new ja(n);if(n.name==="not_equal_any")return new _l(n);if(n.name==="is_nan")return new pl(n);if(n.name==="is_not_nan")return new gl(n);if(n.name==="is_null")return new yl(n);if(n.name==="is_not_null")return new Tl(n);if(n.name==="is_error")return new El(n);if(n.name==="exists")return new wl(n);if(n.name==="not")return new lr(n);if(n.name==="or")return new fl(n);if(n.name==="xor")return new ds(n);if(n.name==="conditional")return new Il(n);if(n.name==="maximum")return new Al(n);if(n.name==="minimum")return new Vl(n);if(n.name==="reverse")return new Ul(n);if(n.name==="replace_first")return new Fl(n);if(n.name==="replace_all")return new ql(n);if(n.name==="char_length")return new Bl(n);if(n.name==="byte_length")return new $l(n);if(n.name==="like")return new zl(n);if(n.name==="regex_contains")return new Gl(n);if(n.name==="regex_match")return new Ql(n);if(n.name==="string_contains")return new jl(n);if(n.name==="starts_with")return new Wl(n);if(n.name==="ends_with")return new Kl(n);if(n.name==="to_lower")return new Hl(n);if(n.name==="to_upper")return new Yl(n);if(n.name==="trim")return new Jl(n);if(n.name==="string_concat")return new Xl(n);if(n.name==="map_get")return new Zl(n);if(n.name==="cosine_distance")return new eh(n);if(n.name==="dot_product")return new th(n);if(n.name==="euclidean_distance")return new nh(n);if(n.name==="vector_length")return new rh(n);if(n.name==="unix_micros_to_timestamp")return new uh(n);if(n.name==="timestamp_to_unix_micros")return new hh(n);if(n.name==="unix_millis_to_timestamp")return new ch(n);if(n.name==="timestamp_to_unix_millis")return new dh(n);if(n.name==="unix_seconds_to_timestamp")return new lh(n);if(n.name==="timestamp_to_unix_seconds")return new mh(n);if(n.name==="timestamp_add")return new fh(n);if(n.name==="timestamp_subtract")return new _h(n)}throw new Error(`Unknown Expr : ${n}`)}class rl{constructor(e){this.expr=e}evaluate(e,t){if(this.expr.fieldName===we)return d.newValue({referenceValue:Bn(e.serializer,t.key)});if(this.expr.fieldName==="__update_time__")return d.newValue({timestampValue:xn(e.serializer,t.version)});if(this.expr.fieldName==="__create_time__")return d.newValue({timestampValue:xn(e.serializer,t.createTime)});const r=t.data.field(this.expr._fieldPath);return r?Kn(r)?d.newValue((function(i,a){if(i.serverTimestampBehavior==="estimate")return{timestampValue:xn(i.serializer,P.fromTimestamp(wt(a)))};if(i.serverTimestampBehavior==="previous"){const o=fn(a);if(o)return o}return{nullValue:"NULL_VALUE"}})(e,r)):d.newValue(r):d.pr()}}class sl{constructor(e){this.expr=e}evaluate(e,t){return d.newValue(this.expr._getValue())}}class il{constructor(e){this.expr=e}evaluate(e,t){const r=this.expr.cr.map((s=>v(s).evaluate(e,t)));return r.some((s=>s.yr()))?d.mr():d.newValue({arrayValue:{values:r.map((s=>s.value))}})}}function Y(n){return nt(n)?Number(n.doubleValue):Number(n.integerValue)}function Pe(n){return BigInt(n.integerValue)}const al=BigInt("0x7fffffffffffffff"),ol=-BigInt("0x8000000000000000");class yn{constructor(e){this.expr=e}evaluate(e,t){I(this.expr.params.length>=2,24778);const r=v(this.expr.params[0]).evaluate(e,t),s=v(this.expr.params[1]).evaluate(e,t);let i=this.br(r,s);for(const a of this.expr.params.slice(2)){const o=v(a).evaluate(e,t);i=this.br(i,o)}return i}br(e,t){if(e.yr()||t.yr())return d.mr();if(e.wr()||t.wr())return d.gr();const r=e.value,s=t.value;if(!nt(r)&&!Ie(r)||!nt(s)&&!Ie(s))return d.mr();if(nt(r)||nt(s)){const i=this.Sr(r,s);return i?d.newValue(i):d.mr()}if(Ie(r)&&Ie(s)){const i=this.vr(r,s);return i===void 0?d.mr():typeof i=="number"?d.newValue({doubleValue:i}):i<ol||i>al?d.mr():d.newValue({integerValue:`${i}`})}return d.mr()}}function Oe(n,e){return Q(n)!==Q(e)?"TYPE_MISMATCH":ue(n)||ue(e)?"NOT_EQ":de(n)&&de(e)?"EQ":de(n)||de(e)?"NULL":Vt(n)&&Vt(e)?(function(r,s){var a,o,u;if(((a=r.values)==null?void 0:a.length)!==((o=s.values)==null?void 0:o.length))return"NOT_EQ";let i=!1;for(let c=0;c<(((u=r.values)==null?void 0:u.length)??0);c++){const l=r.values[c],h=s.values[c];switch(Oe(l,h)){case"EQ":break;case"NOT_EQ":case"TYPE_MISMATCH":return"NOT_EQ";case"NULL":i=!0;break;default:V(44609,{Dr:l,Cr:h})}}return i?"NULL":"EQ"})(n.arrayValue,e.arrayValue):Ln(n)&&Ln(e)||st(n)&&st(e)?(function(r,s){const i=r.fields||{},a=s.fields||{};if(Dn(i)!==Dn(a))return"NOT_EQ";let o=!1;for(const u in i)if(i.hasOwnProperty(u)){if(a[u]===void 0)return"NOT_EQ";switch(Oe(i[u],a[u])){case"NOT_EQ":case"TYPE_MISMATCH":return"NOT_EQ";case"NULL":o=!0}}return o?"NULL":"EQ"})(n.mapValue,e.mapValue):(function(r,s){return ge(r,s,{u:!1,i:!0,o:!0})})(n,e)?"EQ":"NOT_EQ"}class ul extends yn{vr(e,t){return Pe(e)+Pe(t)}Sr(e,t){return{doubleValue:Y(e)+Y(t)}}}class cl extends yn{constructor(e){super(e),this.expr=e}vr(e,t){return Pe(e)-Pe(t)}Sr(e,t){return{doubleValue:Y(e)-Y(t)}}}class ll extends yn{constructor(e){super(e),this.expr=e}vr(e,t){return Pe(e)*Pe(t)}Sr(e,t){return{doubleValue:Y(e)*Y(t)}}}class hl extends yn{constructor(e){super(e),this.expr=e}vr(e,t){const r=Pe(t);if(r!==BigInt(0))return Pe(e)/r}Sr(e,t){const r=Y(t);return r===0?{doubleValue:Jt(r)?Number.NEGATIVE_INFINITY:Number.POSITIVE_INFINITY}:{doubleValue:Y(e)/r}}}class dl extends yn{constructor(e){super(e),this.expr=e}vr(e,t){const r=Pe(t);if(r!==BigInt(0))return Pe(e)%r}Sr(e,t){const r=Y(t);if(r!==0)return{doubleValue:Y(e)%r}}}class ml{constructor(e){this.expr=e}evaluate(e,t){var i;let r=!1,s=!1;for(const a of this.expr.params){const o=v(a).evaluate(e,t);switch(o.type){case"BOOLEAN":if(!((i=o.value)!=null&&i.booleanValue))return d.newValue(K);break;case"NULL":s=!0;break;default:r=!0}}return r?d.mr():s?d.gr():d.newValue(ae)}}class lr{constructor(e){this.expr=e}evaluate(e,t){var s;I(this.expr.params.length===1,9634);const r=v(this.expr.params[0]).evaluate(e,t);switch(r.type){case"BOOLEAN":return d.newValue({booleanValue:!((s=r.value)!=null&&s.booleanValue)});case"NULL":return d.gr();default:return d.mr()}}}class fl{constructor(e){this.expr=e}evaluate(e,t){var i;let r=!1,s=!1;for(const a of this.expr.params){const o=v(a).evaluate(e,t);switch(o.type){case"BOOLEAN":if((i=o.value)!=null&&i.booleanValue)return d.newValue(ae);break;case"NULL":s=!0;break;default:r=!0}}return r?d.mr():s?d.gr():d.newValue(K)}}class ds{constructor(e){this.expr=e}evaluate(e,t){var i;let r=!1,s=!1;for(const a of this.expr.params){const o=v(a).evaluate(e,t);switch(o.type){case"BOOLEAN":r=ds.xor(r,!!((i=o.value)!=null&&i.booleanValue));break;case"NULL":s=!0;break;default:return d.mr()}}return s?d.gr():d.newValue({booleanValue:r})}static xor(e,t){return(e||t)&&!(e&&t)}}class ja{constructor(e){this.expr=e}evaluate(e,t){var a,o;I(this.expr.params.length===2,55094);let r=!1;const s=v(this.expr.params[0]).evaluate(e,t);switch(s.type){case"NULL":r=!0;break;case"ERROR":case"UNSET":return d.mr()}const i=v(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":r=!0;break;default:return d.mr()}if(r)return d.gr();for(const u of((o=(a=i.value)==null?void 0:a.arrayValue)==null?void 0:o.values)??[])switch(de(s.value)&&de(u)?"EQ":Oe(s.value,u)){case"EQ":return d.newValue(ae);case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":r=!0;break;default:V(44608,{value:s.value,candidate:u})}return r?d.gr():d.newValue(K)}}class _l{constructor(e){this.expr=e}evaluate(e,t){return new lr(new f("not",[new f("equal_any",this.expr.params)])).evaluate(e,t)}}class pl{constructor(e){this.expr=e}evaluate(e,t){I(this.expr.params.length===1,23322);const r=v(this.expr.params[0]).evaluate(e,t);switch(r.type){case"INT":return d.newValue(K);case"DOUBLE":return d.newValue({booleanValue:isNaN(Y(r.value))});case"NULL":return d.gr();default:return d.mr()}}}class gl{constructor(e){this.expr=e}evaluate(e,t){return I(this.expr.params.length===1,50406),new lr(new f("not",[new f("is_nan",this.expr.params)])).evaluate(e,t)}}class yl{constructor(e){this.expr=e}evaluate(e,t){switch(I(this.expr.params.length===1,23123),v(this.expr.params[0]).evaluate(e,t).type){case"NULL":return d.newValue(ae);case"UNSET":case"ERROR":return d.mr();default:return d.newValue(K)}}}class Tl{constructor(e){this.expr=e}evaluate(e,t){return I(this.expr.params.length===1,23167),new lr(new f("not",[new f("is_null",this.expr.params)])).evaluate(e,t)}}class El{constructor(e){this.expr=e}evaluate(e,t){return I(this.expr.params.length===1,5228),v(this.expr.params[0]).evaluate(e,t).type==="ERROR"?d.newValue(ae):d.newValue(K)}}class wl{constructor(e){this.expr=e}evaluate(e,t){switch(I(this.expr.params.length===1,6877),v(this.expr.params[0]).evaluate(e,t).type){case"ERROR":return d.mr();case"UNSET":return d.newValue(K);default:return d.newValue(ae)}}}class Il{constructor(e){this.expr=e}evaluate(e,t){var s;I(this.expr.params.length===3,11706);const r=v(this.expr.params[0]).evaluate(e,t);switch(r.type){case"BOOLEAN":return(s=r.value)!=null&&s.booleanValue?v(this.expr.params[1]).evaluate(e,t):v(this.expr.params[2]).evaluate(e,t);case"NULL":return v(this.expr.params[2]).evaluate(e,t);default:return d.mr()}}}class Al{constructor(e){this.expr=e}evaluate(e,t){const r=this.expr.params.map((i=>v(i).evaluate(e,t)));let s;for(const i of r)switch(i.type){case"ERROR":case"UNSET":case"NULL":continue;default:s=s===void 0||oe(i.value,s.value)>0?i:s}return s===void 0?d.gr():s}}class Vl{constructor(e){this.expr=e}evaluate(e,t){const r=this.expr.params.map((i=>v(i).evaluate(e,t)));let s;for(const i of r)switch(i.type){case"ERROR":case"UNSET":case"NULL":continue;default:s=s===void 0||oe(i.value,s.value)<0?i:s}return s===void 0?d.gr():s}}class Nt{constructor(e){this.expr=e}evaluate(e,t){I(this.expr.params.length===2,31033,`${this.expr.name}() function should have exactly 2 params`);const r=v(this.expr.params[0]).evaluate(e,t);switch(r.type){case"ERROR":case"UNSET":return d.mr()}const s=v(this.expr.params[1]).evaluate(e,t);switch(s.type){case"ERROR":case"UNSET":return d.mr()}return this.Fr(r,s)}}class vl extends Nt{constructor(e){super(e),this.expr=e}Fr(e,t){if(e.wr()&&t.wr())return d.newValue(ae);if(e.wr()||t.wr()||ue(e.value)||ue(t.value)||Q(e.value)!==Q(t.value))return d.newValue(K);switch(Oe(e.value,t.value)){case"EQ":return d.newValue(ae);case"NOT_EQ":return d.newValue(K);case"NULL":return d.gr();default:V(44615,{left:e,right:t})}}}class Rl extends Nt{constructor(e){super(e),this.expr=e}Fr(e,t){switch(Oe(e.value,t.value)){case"EQ":return d.newValue(K);case"NOT_EQ":case"TYPE_MISMATCH":return d.newValue(ae);case"NULL":return d.gr();default:V(44614,{left:e,right:t})}}}class Pl extends Nt{constructor(e){super(e),this.expr=e}Fr(e,t){return Q(e.value)!==Q(t.value)||ue(e.value)||ue(t.value)?d.newValue(K):d.newValue({booleanValue:oe(e.value,t.value)<0})}}class Cl extends Nt{constructor(e){super(e),this.expr=e}Fr(e,t){return Q(e.value)!==Q(t.value)||ue(e.value)||ue(t.value)?d.newValue(K):Oe(e.value,t.value)==="EQ"?d.newValue(ae):d.newValue({booleanValue:oe(e.value,t.value)<0})}}class Sl extends Nt{constructor(e){super(e),this.expr=e}Fr(e,t){return Q(e.value)!==Q(t.value)||ue(e.value)||ue(t.value)?d.newValue(K):d.newValue({booleanValue:oe(e.value,t.value)>0})}}class xl extends Nt{constructor(e){super(e),this.expr=e}Fr(e,t){return Q(e.value)!==Q(t.value)||ue(e.value)||ue(t.value)?d.newValue(K):Oe(e.value,t.value)==="EQ"?d.newValue(ae):d.newValue({booleanValue:oe(e.value,t.value)>0})}}class bl{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class Nl{constructor(e){this.expr=e}evaluate(e,t){var s;I(this.expr.params.length===1,216);const r=v(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return d.gr();case"ARRAY":{const i=((s=r.value.arrayValue)==null?void 0:s.values)??[];return d.newValue({arrayValue:{values:[...i].reverse()}})}default:return d.mr()}}}class Dl{constructor(e){this.expr=e}evaluate(e,t){return I(this.expr.params.length===2,52884),new ja(new f("eq_any",[this.expr.params[1],this.expr.params[0]])).evaluate(e,t)}}class kl{constructor(e){this.expr=e}evaluate(e,t){var u,c,l,h;I(this.expr.params.length===2,1392);let r=!1;const s=v(this.expr.params[0]).evaluate(e,t);switch(s.type){case"ARRAY":break;case"NULL":r=!0;break;default:return d.mr()}const i=v(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":r=!0;break;default:return d.mr()}if(r)return d.gr();const a=((c=(u=i.value)==null?void 0:u.arrayValue)==null?void 0:c.values)??[],o=((h=(l=s.value)==null?void 0:l.arrayValue)==null?void 0:h.values)??[];for(const m of a){let g=!1;r=!1;for(const y of o){switch(de(m)&&de(y)?"EQ":Oe(m,y)){case"EQ":g=!0;break;case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":r=!0;break;default:V(44613,{value:y,search:m})}if(g)break}if(!g)return d.newValue(K)}return d.newValue(ae)}}class Ll{constructor(e){this.expr=e}evaluate(e,t){var u,c,l,h;I(this.expr.params.length===2,2680);let r=!1;const s=v(this.expr.params[0]).evaluate(e,t);switch(s.type){case"ARRAY":break;case"NULL":r=!0;break;default:return d.mr()}const i=v(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":r=!0;break;default:return d.mr()}if(r)return d.gr();const a=((c=(u=i.value)==null?void 0:u.arrayValue)==null?void 0:c.values)??[],o=((h=(l=s.value)==null?void 0:l.arrayValue)==null?void 0:h.values)??[];for(const m of o)for(const g of a)switch(de(m)&&de(g)?"EQ":Oe(m,g)){case"EQ":return d.newValue(ae);case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":r=!0;break;default:V(60403,{value:m,search:g})}return r?d.gr():d.newValue(K)}}class Ol{constructor(e){this.expr=e}evaluate(e,t){var s,i,a;I(this.expr.params.length===1,38605);const r=v(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return d.gr();case"ARRAY":return d.newValue({integerValue:`${((a=(i=(s=r.value)==null?void 0:s.arrayValue)==null?void 0:i.values)==null?void 0:a.length)??0}`});default:return d.mr()}}}class Ml{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class Ul{constructor(e){this.expr=e}evaluate(e,t){var s,i;I(this.expr.params.length===1,1508);const r=v(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return d.gr();case"BYTES":{const a=(s=r.value)==null?void 0:s.bytesValue;if(typeof a=="string"){const o=G.fromBase64String(a).toUint8Array();return o.reverse(),d.newValue({bytesValue:G.fromUint8Array(o).toBase64()})}return d.newValue({bytesValue:new Uint8Array(a).reverse()})}case"STRING":{const a=(i=r.value)==null?void 0:i.stringValue,o=new Intl.__PRIVATE_Segmenter(void 0,{granularity:"grapheme"}).segment(a),u=Array.from(o,(c=>c.segment)).reverse();return d.newValue({stringValue:u.join("")})}default:return d.mr()}}}class Fl{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class ql{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class Bl{constructor(e){this.expr=e}evaluate(e,t){I(this.expr.params.length===1,19400);const r=v(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return d.gr();case"STRING":{const s=(function(a){let o=0;for(let u=0;u<a.length;u++){const c=a.codePointAt(u);if(c===void 0)return;if(c<=65535)if(c>=55296&&c<=57343)if(c<=56319){const l=a.codePointAt(u+1);l!==void 0&&l>=56320&&l<=57343?(o+=1,u++):o+=1}else o+=1;else o+=1;else{if(!(c<=1114111))return;o+=1,u++}}return o})(r.value.stringValue);return s===void 0?d.mr():d.newValue({integerValue:s})}default:return d.mr()}}}class $l{constructor(e){this.expr=e}evaluate(e,t){var s,i;I(this.expr.params.length===1,8486);const r=v(this.expr.params[0]).evaluate(e,t);switch(r.type){case"BYTES":{const a=(s=r.value)==null?void 0:s.bytesValue;return typeof a=="string"?d.newValue({integerValue:G.fromBase64String(a).toUint8Array().length}):d.newValue({integerValue:new Uint8Array(a).length})}case"STRING":{const a=(function(u){let c=0;for(let l=0;l<u.length;l++){const h=u.codePointAt(l);if(h===void 0)return;if(h>=55296&&h<=57343){if(!(h<=56319))return;{const m=u.codePointAt(l+1);if(m===void 0||!(m>=56320&&m<=57343))return;c+=4,l++}}else if(h<=127)c+=1;else if(h<=2047)c+=2;else if(h<=65535)c+=3;else{if(!(h<=1114111))return;c+=4,l++}}return c})((i=r.value)==null?void 0:i.stringValue);return a===void 0?d.mr():d.newValue({integerValue:a})}case"NULL":return d.gr();default:return d.mr()}}}class Dt{constructor(e){this.expr=e}evaluate(e,t){var a,o;I(this.expr.params.length===2,39773,`${this.expr.name}() function should have exactly two parameters`);let r=!1;const s=v(this.expr.params[0]).evaluate(e,t);switch(s.type){case"STRING":break;case"NULL":r=!0;break;default:return d.mr()}const i=v(this.expr.params[1]).evaluate(e,t);switch(i.type){case"STRING":break;case"NULL":r=!0;break;default:return d.mr()}return r?d.gr():this.Or((a=s.value)==null?void 0:a.stringValue,(o=i.value)==null?void 0:o.stringValue)}}class zl extends Dt{Or(e,t){try{const r=(function(a){let o="";for(let u=0;u<a.length;u++){const c=a.charAt(u);switch(c){case"_":o+=".";break;case"%":o+=".*";break;case"\\":case".":case"*":case"?":case"+":case"^":case"$":case"|":case"(":case")":case"[":case"]":case"{":case"}":o+="\\"+c;break;default:o+=c}}return"^"+o+"$"})(t),s=Qr.compile(r);return d.newValue({booleanValue:s.matches(e)})}catch(r){return ye(`Invalid LIKE pattern converted to regex: ${t}, returning error. Error: ${r}`),d.mr()}}}class Gl extends Dt{Or(e,t){try{const r=Qr.compile(t);return d.newValue({booleanValue:r.test(e)})}catch{return ye(`Invalid regex pattern found in regex_contains: ${t}, returning error`),d.mr()}}}class Ql extends Dt{Or(e,t){try{return d.newValue({booleanValue:Qr.compile(t).matches(e)})}catch{return ye(`Invalid regex pattern found in regex_match: ${t}, returning error`),d.mr()}}}class jl extends Dt{Or(e,t){return d.newValue({booleanValue:e.includes(t)})}}class Wl extends Dt{Or(e,t){return d.newValue({booleanValue:e.startsWith(t)})}}class Kl extends Dt{Or(e,t){return d.newValue({booleanValue:e.endsWith(t)})}}class Hl{constructor(e){this.expr=e}evaluate(e,t){var s,i;I(this.expr.params.length===1,29079);const r=v(this.expr.params[0]).evaluate(e,t);switch(r.type){case"STRING":return d.newValue({stringValue:(i=(s=r.value)==null?void 0:s.stringValue)==null?void 0:i.toLowerCase()});case"NULL":return d.gr();default:return d.mr()}}}class Yl{constructor(e){this.expr=e}evaluate(e,t){var s,i;I(this.expr.params.length===1,60487);const r=v(this.expr.params[0]).evaluate(e,t);switch(r.type){case"STRING":return d.newValue({stringValue:(i=(s=r.value)==null?void 0:s.stringValue)==null?void 0:i.toUpperCase()});case"NULL":return d.gr();default:return d.mr()}}}class Jl{constructor(e){this.expr=e}evaluate(e,t){var s,i;I(this.expr.params.length===1,28544);const r=v(this.expr.params[0]).evaluate(e,t);switch(r.type){case"STRING":return d.newValue({stringValue:(i=(s=r.value)==null?void 0:s.stringValue)==null?void 0:i.trim()});case"NULL":return d.gr();default:return d.mr()}}}class Xl{constructor(e){this.expr=e}evaluate(e,t){const r=this.expr.params.map((a=>v(a).evaluate(e,t)));let s="",i=!1;for(const a of r)switch(a.type){case"STRING":s+=a.value.stringValue;break;case"NULL":i=!0;break;default:return d.mr()}return i?d.gr():d.newValue({stringValue:s})}}class Zl{constructor(e){this.expr=e}evaluate(e,t){var a,o,u,c;I(this.expr.params.length===2,4483);const r=v(this.expr.params[0]).evaluate(e,t);switch(r.type){case"UNSET":return d.pr();case"MAP":break;default:return d.mr()}const s=v(this.expr.params[1]).evaluate(e,t);if(s.type!=="STRING")return d.mr();const i=(c=(o=(a=r.value)==null?void 0:a.mapValue)==null?void 0:o.fields)==null?void 0:c[(u=s.value)==null?void 0:u.stringValue];return i===void 0?d.pr():d.newValue(i)}}class ms{constructor(e){this.expr=e}evaluate(e,t){var c,l;I(this.expr.params.length===2,25231,`${this.expr.name}() function should have exactly 2 params`);let r=!1;const s=v(this.expr.params[0]).evaluate(e,t);switch(s.type){case"VECTOR":break;case"NULL":r=!0;break;default:return d.mr()}const i=v(this.expr.params[1]).evaluate(e,t);switch(i.type){case"VECTOR":break;case"NULL":r=!0;break;default:return d.mr()}if(r)return d.gr();const a=xr(s.value),o=xr(i.value);if(a===void 0||o===void 0||((c=a.values)==null?void 0:c.length)!==((l=o.values)==null?void 0:l.length))return d.mr();const u=this.Mr(a,o);return u===void 0||isNaN(u)?d.mr():d.newValue({doubleValue:u})}}class eh extends ms{Mr(e,t){const r=(e==null?void 0:e.values)??[],s=(t==null?void 0:t.values)??[];if(r.length===0)return;let i=0,a=0,o=0;for(let c=0;c<r.length;c++){if(!ze(r[c])||!ze(s[c]))return;const l=Y(r[c]),h=Y(s[c]);i+=l*h,a+=l*l,o+=h*h}const u=Math.sqrt(a)*Math.sqrt(o);if(u!==0)return 1-Math.max(-1,Math.min(1,i/u))}}class th extends ms{Mr(e,t){const r=(e==null?void 0:e.values)??[],s=(t==null?void 0:t.values)??[];if(r.length===0)return 0;let i=0;for(let a=0;a<r.length;a++){if(!ze(r[a])||!ze(s[a]))return;i+=Y(r[a])*Y(s[a])}return i}}class nh extends ms{Mr(e,t){const r=(e==null?void 0:e.values)??[],s=(t==null?void 0:t.values)??[];if(r.length===0)return 0;let i=0;for(let a=0;a<r.length;a++){if(!ze(r[a])||!ze(s[a]))return;const o=Y(r[a]),u=Y(s[a]);i+=Math.pow(o-u,2)}return Math.sqrt(i)}}class rh{constructor(e){this.expr=e}evaluate(e,t){var s;I(this.expr.params.length===1,39044);const r=v(this.expr.params[0]).evaluate(e,t);switch(r.type){case"VECTOR":{const i=xr(r.value);return d.newValue({integerValue:((s=i==null?void 0:i.values)==null?void 0:s.length)??0})}case"NULL":return d.gr();default:return d.mr()}}}const un=BigInt(-62135596800),cn=BigInt(253402300799),zn=BigInt(1e3),qe=BigInt(1e6),sh=un*zn,ih=cn*zn+BigInt(999),ah=un*qe,oh=cn*qe+BigInt(999999);function fs(n){return n>=ah&&n<=oh}function Wa(n){return n>=un&&n<=cn}function ln(n,e){const t=BigInt(n);return!(t<un||t>cn)&&!(e<0||e>=1e9)&&(t!==un||e===0)&&!(t===cn&&e>999999999)}function Ka(n,e){return e<0?{seconds:n-1,nanos:e+1e9}:{seconds:n,nanos:e}}function _s(n){return BigInt(n.seconds)*qe+BigInt(Math.trunc(n.nanoseconds/1e3))}class ps{constructor(e){this.expr=e}evaluate(e,t){I(this.expr.params.length===1,49262,`${this.expr.name}() function should have exactly one parameter`);const r=v(this.expr.params[0]).evaluate(e,t);switch(r.type){case"INT":return this.toTimestamp(BigInt(r.value.integerValue));case"NULL":return d.gr();default:return d.mr()}}}class uh extends ps{toTimestamp(e){if(!fs(e))return d.mr();let t=Number(e/qe),r=Number(e%qe*BigInt(1e3));const s=Ka(t,r);return t=s.seconds,r=s.nanos,ln(t,r)?d.newValue({timestampValue:{seconds:t,nanos:r}}):d.mr()}}class ch extends ps{toTimestamp(e){if(!(function(a){return a>=sh&&a<=ih})(e))return d.mr();let t=Number(e/zn),r=Number(e%zn*BigInt(1e6));const s=Ka(t,r);return t=s.seconds,r=s.nanos,ln(t,r)?d.newValue({timestampValue:{seconds:t,nanos:r}}):d.mr()}}class lh extends ps{toTimestamp(e){if(!Wa(e))return d.mr();const t=Number(e);return d.newValue({timestampValue:{seconds:t,nanos:0}})}}class gs{constructor(e){this.expr=e}evaluate(e,t){I(this.expr.params.length===1,1265,`${this.expr.name}() function should have exactly one parameter`);const r=v(this.expr.params[0]).evaluate(e,t);switch(r.type){case"TIMESTAMP":break;case"NULL":return d.gr();default:return d.mr()}const s=ts(r.value.timestampValue);return ln(s.seconds,s.nanoseconds)?this.Nr(s):d.mr()}}class hh extends gs{Nr(e){const t=_s(e);return fs(t)?d.newValue({integerValue:`${t.toString()}`}):d.mr()}}class dh extends gs{Nr(e){const t=_s(e),r=t/BigInt(1e3),s=t%BigInt(1e3);return r>BigInt(0)||s===BigInt(0)?d.newValue({integerValue:r.toString()}):d.newValue({integerValue:(r-BigInt(1)).toString()})}}class mh extends gs{Nr(e){const t=BigInt(e.seconds);return Wa(t)?d.newValue({integerValue:t.toString()}):d.mr()}}class Ha{constructor(e){this.expr=e}evaluate(e,t){I(this.expr.params.length===3,2775,`${this.expr.name}() function should have exactly 3 parameters`);let r=!1;const s=v(this.expr.params[0]).evaluate(e,t);switch(s.type){case"TIMESTAMP":break;case"NULL":r=!0;break;default:return d.mr()}const i=v(this.expr.params[1]).evaluate(e,t);let a;switch(i.type){case"STRING":if(a=(function(U){switch(U){case"microsecond":return"microsecond";case"millisecond":return"millisecond";case"second":return"second";case"minute":return"minute";case"hour":return"hour";case"day":return"day";default:return}})(i.value.stringValue),a===void 0)return d.mr();break;case"NULL":r=!0;break;default:return d.mr()}const o=v(this.expr.params[2]).evaluate(e,t);switch(o.type){case"INT":break;case"NULL":r=!0;break;default:return d.mr()}if(r)return d.gr();const u=BigInt(o.value.integerValue);let c;try{switch(a){case"microsecond":c=u;break;case"millisecond":c=u*BigInt(1e3);break;case"second":c=u*BigInt(1e6);break;case"minute":c=u*BigInt(6e7);break;case"hour":c=u*BigInt(36e8);break;case"day":c=u*BigInt(864e8);break;default:return d.mr()}if(a!=="microsecond"&&u!==BigInt(0)&&c/u!==BigInt(this.Lr(a)))return d.mr()}catch(L){return ye(`Error during timestamp arithmetic: ${L}`),d.mr()}const l=ts(s.value.timestampValue);if(!ln(l.seconds,l.nanoseconds))return d.mr();const h=_s(l),m=this.Br(h,c);if(!fs(m))return d.mr();const g=Number(m/qe),y=m%qe,S=Number((y<0?y+qe:y)*BigInt(1e3)),R=y<0?g-1:g;return ln(R,S)?d.newValue({timestampValue:{seconds:R,nanos:S}}):d.mr()}Lr(e){switch(e){case"millisecond":return 1e3;case"second":return 1e6;case"minute":return 6e7;case"hour":return 36e8;case"day":return 864e8;default:return 1}}}class fh extends Ha{Br(e,t){return e+t}}class _h extends Ha{Br(e,t){return e-t}}function hn(n){if((n=Qa(n))instanceof xt)return`fld(${n.fieldName})`;if(n instanceof bt)return`cst(${(function(t){return t===null?"null":typeof t=="number"?t.toString():typeof t=="string"?`"${t}"`:t instanceof F?`ref(${t.path})`:t instanceof ie?`vec(${JSON.stringify(t)})`:JSON.stringify(t)})(n.value)})`;if(n instanceof f)return`fn(${n.name},[${n.params.map(hn).join(",")}])`;if(n.expressionType==="ListOfExpressions")return`list([${n.cr.map(hn).join(",")}])`;throw new Error(`Unrecognized expr ${JSON.stringify(n,null,2)}`)}function ph(n){if(n instanceof $a)return`${n._name}(${Rn(n.fields)})`;if(n instanceof za){let e=`${n._name}(${Rn(n.accumulators)})`;return n.groups.size>0&&(e+=`grouping(${Rn(n.groups)})`),e}if(n instanceof Ga)return`${n._name}(${Rn(n.groups)})`;if(n instanceof ar)return`${n._name}(${n.hr})`;if(n instanceof or)return`${n._name}(${n.collectionId})`;if(n instanceof us)return`${n._name}()`;if(n instanceof cs)return`${n._name}(${n.Tr.sort()})`;if(n instanceof ur)return`${n._name}(${hn(n.condition)})`;if(n instanceof ut)return`${n._name}(${n.limit})`;if(n instanceof xe)return`${n._name}(${(function(t){return t.map((r=>`${hn(r.expr)}${r.direction}`)).join(",")})(n.orderings)})`;throw new Error(`Unrecognized stage ${n._name}`)}function Rn(n){return`${Array.from(n.entries()).sort().map((([e,t])=>`${e}=${hn(t)}`)).join(",")}`}function De(n){return n.stages.map((e=>ph(e))).join("|")}function Ya(n,e){return De(n)===De(e)}function j(n){return n instanceof te}function gi(n){return j(n)?De(n):Qt(n)}function Ja(n){return j(n)?De(n):(function(t){return`${sa(Ae(t))}|lt:${t.limitType}`})(n)}function hr(n,e){return n instanceof te&&e instanceof te?Ya(n,e):!(n instanceof te&&!(e instanceof te)||!(n instanceof te)&&e instanceof te)&&Lu(n,e)}function Xa(n){return tt(n)?De(n):sa(n)}function Za(n,e){return n instanceof te&&e instanceof te?Ya(n,e):!(n instanceof te&&!(e instanceof te)||!(n instanceof te)&&e instanceof te)&&ia(n,e)}function gh(n,e){const t=(function(s){let i=!1;const a=[];for(const o of s)if(o instanceof xe)if(i=!0,o.orderings.some((u=>u.expr instanceof xt&&u.expr.fieldName===we)))a.push(o);else{const u=o.orderings.map((c=>c));u.push(bn(we).ascending()),a.push(new xe(u,{}))}else o instanceof ut&&(i||(a.push(new xe([bn(we).ascending()],{})),i=!0)),a.push(o);return i||a.push(new xe([bn(we).ascending()],{})),a})(n.stages);if(n.userDataReader){const r=n.userDataReader.createContext(3,"toCorePipeline");t.forEach((s=>s._readUserData(r)))}return new te(n.userDataReader.serializer,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yh{constructor(e,t,r,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(e,t){const r=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(e.key)&&_u(i,e,r[s])}}applyToLocalView(e,t){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(t=zt(r,e,t,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(t=zt(r,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const r=ha();return this.mutations.forEach((s=>{const i=e.get(s.key),a=i.overlayedDocument;let o=this.applyToLocalView(a,i.mutatedFields);o=t.has(s.key)?null:o;const u=Yi(a,o);u!==null&&r.set(s.key,u),a.isValidDocument()||a.convertToNoDocument(P.min())})),r}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),x())}isEqual(e){return this.batchId===e.batchId&&Et(this.mutations,e.mutations,((t,r)=>Ks(t,r)))&&Et(this.baseMutations,e.baseMutations,((t,r)=>Ks(t,r)))}}class ys{constructor(e,t,r,s){this.batch=e,this.commitVersion=t,this.mutationResults=r,this.docVersions=s}static from(e,t,r){I(e.mutations.length===r.length,58842,{Ur:e.mutations.length,kr:r.length});let s=(function(){return qu})();const i=e.mutations;for(let a=0;a<i.length;a++)s=s.insert(i[a].key,r[a].version);return new ys(e,t,r,s)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eo="";function Th(n){let e="";for(let t=0;t<n.length;t++)e.length>0&&(e=yi(e)),e=Eh(n.get(t),e);return yi(e)}function Eh(n,e){let t=e;const r=n.length;for(let s=0;s<r;s++){const i=n.charAt(s);switch(i){case"\0":t+="";break;case eo:t+="";break;default:t+=i}}return t}function yi(n){return n+eo+""}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wh{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class be{constructor(e,t,r,s,i=P.min(),a=P.min(),o=G.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=t,this.purpose=r,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=o,this.expectedCount=u}withSequenceNumber(e){return new be(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new be(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new be(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new be(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ih{constructor(e){this.$r=e}}function Ah(n){const e=rc({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Dr(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vh{constructor(){this.Zi=new vh}addToCollectionParentIndex(e,t){return this.Zi.add(t),p.resolve()}getCollectionParents(e,t){return p.resolve(this.Zi.getEntries(t))}addFieldIndex(e,t){return p.resolve()}deleteFieldIndex(e,t){return p.resolve()}deleteAllFieldIndexes(e){return p.resolve()}createTargetIndexes(e,t){return p.resolve()}getDocumentsMatchingTarget(e,t){return p.resolve(null)}getIndexType(e,t){return p.resolve(0)}getFieldIndexes(e,t){return p.resolve([])}getNextCollectionGroupToUpdate(e){return p.resolve(null)}getMinOffset(e,t){return p.resolve(Ge.min())}getMinOffsetFromCollectionGroup(e,t){return p.resolve(Ge.min())}updateCollectionGroup(e,t,r){return p.resolve()}updateIndexEntries(e,t){return p.resolve()}}class vh{constructor(){this.index={}}add(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t]||new z(D.comparator),i=!s.has(r);return this.index[t]=s.add(r),i}has(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t];return s&&s.has(r)}getEntries(e){return(this.index[e]||new z(D.comparator)).toArray()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class He{constructor(e){this.ys=e}next(){return this.ys+=2,this.ys}static ws(){return new He(0)}static bs(){return new He(-1)}}// Copyright 2024 Google LLC* @license
function to(n,e){var r;let t=e;for(const s of n.stages)t=Ph({serializer:n.serializer,serverTimestampBehavior:(r=n.listenOptions)==null?void 0:r.serverTimestampBehavior},s,t);return t}function dr(n,e){return to(n,[e]).length>0}function Rh(n,e){return j(n)?dr(n,e):er(n,e)}function Ph(n,e,t){if(e instanceof ar)return(function(s,i,a){return a.filter((o=>o.isFoundDocument()&&`/${o.key.getCollectionPath().canonicalString()}`===i.hr))})(0,e,t);if(e instanceof ur)return(function(s,i,a){return a.filter((o=>{const u=Ht(v(i.condition).evaluate(s,o));return u!==void 0&&ge(u,ae)}))})(n,e,t);if(e instanceof or)return(function(s,i,a){return a.filter((o=>o.isFoundDocument()&&o.key.getCollectionPath().lastSegment()===i.collectionId))})(0,e,t);if(e instanceof us)return(function(s,i,a){return a.filter((o=>o.isFoundDocument()))})(0,0,t);if(e instanceof cs)return(function(s,i,a){return a.filter((o=>o.isFoundDocument()&&i.Pr.has(o.key.path.toStringWithLeadingSlash())))})(0,e,t);if(e instanceof ut)return(function(s,i,a){return a.slice(0,i.limit)})(0,e,t);if(e instanceof xe)return(function(s,i,a){const o=i.orderings.map((u=>({Ms:v(u.expr),direction:u.direction})));return[...a].sort(((u,c)=>{for(const{Ms:l,direction:h}of o){const m=Ht(l.evaluate(s,u)),g=Ht(l.evaluate(s,c)),y=oe(m??It,g??It);if(y!==0)return h==="ascending"?y:-y}return 0}))})(n,e,t);throw new Error(`Unknown stage: ${e._name}`)}function Fr(n){const e=(function(r){for(let s=r.stages.length-1;s>=0;s--){const i=r.stages[s];if(i instanceof xe)return i.orderings}throw new Error("Pipeline must contain at least one Sort stage")})(n);return(t,r)=>{for(const s of e){const i=Ht(v(s.expr).evaluate({serializer:n.serializer},t)),a=Ht(v(s.expr).evaluate({serializer:n.serializer},r)),o=oe(i||It,a||It);if(o!==0)return s.direction==="ascending"?o:-o}return 0}}function Vr(n){for(let e=n.stages.length-1;e>=0;e--){const t=n.stages[e];if(t instanceof ut)return{limit:t.limit}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ch{constructor(){this.changes=new ct((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Z.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const r=this.changes.get(t);return r!==void 0?p.resolve(r):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sh{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xh{constructor(e,t,r,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=r,this.indexManager=s}getDocument(e,t){let r=null;return this.documentOverlayCache.getOverlay(e,t).next((s=>(r=s,this.remoteDocumentCache.getEntry(e,t)))).next((s=>(r!==null&&zt(r.mutation,s,he.empty(),k.now()),s)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((r=>this.getLocalViewOfDocuments(e,r,x()).next((()=>r))))}getLocalViewOfDocuments(e,t,r=x()){const s=Me();return this.populateOverlays(e,s,t).next((()=>this.computeViews(e,t,s,r).next((i=>{let a=_t();return i.forEach(((o,u)=>{a=a.insert(o,u.overlayedDocument)})),a}))))}getOverlayedDocuments(e,t){const r=Me();return this.populateOverlays(e,r,t).next((()=>this.computeViews(e,t,r,x())))}populateOverlays(e,t,r){const s=[];return r.forEach((i=>{t.has(i)||s.push(i)})),this.documentOverlayCache.getOverlays(e,s).next((i=>{i.forEach(((a,o)=>{t.set(a,o)}))}))}computeViews(e,t,r,s){let i=se();const a=jt(),o=(function(){return jt()})();return t.forEach(((u,c)=>{const l=r.get(c.key);s.has(c.key)&&(l===void 0||l.mutation instanceof Ze)?i=i.insert(c.key,c):l!==void 0?(a.set(c.key,l.mutation.getFieldMask()),zt(l.mutation,c,l.mutation.getFieldMask(),k.now())):a.set(c.key,he.empty())})),this.recalculateAndSaveOverlays(e,i).next((u=>(u.forEach(((c,l)=>a.set(c,l))),t.forEach(((c,l)=>o.set(c,new Sh(l,a.get(c)??null)))),o)))}recalculateAndSaveOverlays(e,t){const r=jt();let s=new O(((a,o)=>a-o)),i=x();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((a=>{for(const o of a)o.keys().forEach((u=>{const c=t.get(u);if(c===null)return;let l=r.get(u)||he.empty();l=o.applyToLocalView(c,l),r.set(u,l);const h=(s.get(o.batchId)||x()).add(u);s=s.insert(o.batchId,h)}))})).next((()=>{const a=[],o=s.getReverseIterator();for(;o.hasNext();){const u=o.getNext(),c=u.key,l=u.value,h=ha();l.forEach((m=>{if(!i.has(m)){const g=Yi(t.get(m),r.get(m));g!==null&&h.set(m,g),i=i.add(m)}})),a.push(this.documentOverlayCache.saveOverlays(e,c,h))}return p.waitFor(a)})).next((()=>r))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((r=>this.recalculateAndSaveOverlays(e,r)))}getDocumentsMatchingQuery(e,t,r,s){return j(t)?this.getDocumentsMatchingPipeline(e,t,r,s):Nu(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):oa(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,r,s):this.getDocumentsMatchingCollectionQuery(e,t,r,s)}getNextDocuments(e,t,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,r,s).next((i=>{const a=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,r.largestBatchId,s-i.size):p.resolve(Me());let o=sn,u=i;return a.next((c=>p.forEach(c,((l,h)=>(o<h.largestBatchId&&(o=h.largestBatchId),i.get(l)?p.resolve():this.remoteDocumentCache.getEntry(e,l).next((m=>{u=u.insert(l,m)}))))).next((()=>this.populateOverlays(e,c,i))).next((()=>this.computeViews(e,u,c,x()))).next((l=>({batchId:o,changes:la(l)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new A(t)).next((r=>{let s=_t();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s}))}getDocumentsMatchingCollectionGroupQuery(e,t,r,s){const i=t.collectionGroup;let a=_t();return this.indexManager.getCollectionParents(e,i).next((o=>p.forEach(o,(u=>{const c=(function(h,m){return new Pt(m,null,h.explicitOrderBy.slice(),h.filters.slice(),h.limit,h.limitType,h.startAt,h.endAt)})(t,u.child(i));return this.getDocumentsMatchingCollectionQuery(e,c,r,s).next((l=>{l.forEach(((h,m)=>{a=a.insert(h,m)}))}))})).next((()=>a))))}getDocumentsMatchingCollectionQuery(e,t,r,s){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,r.largestBatchId).next((a=>(i=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,i,s)))).next((a=>this.retrieveMatchingLocalDocuments(i,a,(o=>er(t,o)))))}getDocumentsMatchingPipeline(e,t,r,s){if(Fe(t)==="collection_group"){const i=hs(t);let a=_t();return this.indexManager.getCollectionParents(e,i).next((o=>p.forEach(o,(u=>{const c=(function(h,m){const g=h.stages.map((y=>y instanceof or?new ar(m.canonicalString(),{}):y));return new te(h.serializer,g)})(t,u.child(i));return this.getDocumentsMatchingPipeline(e,c,r,s).next((l=>{l.forEach(((h,m)=>{a=a.insert(h,m)}))}))})).next((()=>a))))}{let i;return this.getOverlaysForPipeline(e,t,r.largestBatchId).next((a=>{switch(i=a,Fe(t)){case"collection":return this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,i,s);case"documents":let o=x();for(const u of Ur(t))o=o.add(A.fromPath(u));return this.remoteDocumentCache.getEntries(e,o);case"database":return this.remoteDocumentCache.getAllEntries(e);default:throw new E("invalid-argument",`Invalid pipeline source to execute offline: ${De(t)}`)}})).next((a=>this.retrieveMatchingLocalDocuments(i,a,(o=>dr(t,o)))))}}retrieveMatchingLocalDocuments(e,t,r){e.forEach(((i,a)=>{const o=a.getKey();t.get(o)===null&&(t=t.insert(o,Z.newInvalidDocument(o)))}));let s=_t();return t.forEach(((i,a)=>{const o=e.get(i);o!==void 0&&zt(o.mutation,a,he.empty(),k.now()),r(a)&&(s=s.insert(i,a))})),s}getOverlaysForPipeline(e,t,r){switch(Fe(t)){case"collection":return this.documentOverlayCache.getOverlaysForCollection(e,D.fromString(cr(t)),r);case"collection_group":throw new E("invalid-argument",`Unexpected collection group pipeline: ${De(t)}`);case"documents":return this.documentOverlayCache.getOverlays(e,Ur(t).map((s=>A.fromPath(s))));case"database":return this.documentOverlayCache.getAllOverlays(e,r);default:throw new E("invalid-argument",`Failed to get overlays for pipeline: ${De(t)}`)}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bh{constructor(e){this.serializer=e,this.Qs=new Map,this.Ws=new Map}getBundleMetadata(e,t){return p.resolve(this.Qs.get(t))}saveBundleMetadata(e,t){return this.Qs.set(t.id,(function(s){return{id:s.id,version:s.version,createTime:Ve(s.createTime)}})(t)),p.resolve()}getNamedQuery(e,t){return p.resolve(this.Ws.get(t))}saveNamedQuery(e,t){return this.Ws.set(t.name,(function(s){return{name:s.name,query:Ah(s.bundledQuery),readTime:Ve(s.readTime)}})(t)),p.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nh{constructor(){this.overlays=new O(A.comparator),this.Gs=new Map}getOverlay(e,t){return p.resolve(this.overlays.get(t))}getOverlays(e,t){const r=Me();return p.forEach(t,(s=>this.getOverlay(e,s).next((i=>{i!==null&&r.set(s,i)})))).next((()=>r))}getAllOverlays(e,t){const r=Me();return this.overlays.forEach(((s,i)=>{i.largestBatchId>t&&r.set(s,i)})),p.resolve(r)}saveOverlays(e,t,r){return r.forEach(((s,i)=>{this.Zr(e,t,i)})),p.resolve()}removeOverlaysForBatchId(e,t,r){const s=this.Gs.get(r);return s!==void 0&&(s.forEach((i=>this.overlays=this.overlays.remove(i))),this.Gs.delete(r)),p.resolve()}getOverlaysForCollection(e,t,r){const s=Me(),i=t.length+1,a=new A(t.child("")),o=this.overlays.getIteratorFrom(a);for(;o.hasNext();){const u=o.getNext().value,c=u.getKey();if(!t.isPrefixOf(c.path))break;c.path.length===i&&u.largestBatchId>r&&s.set(u.getKey(),u)}return p.resolve(s)}getOverlaysForCollectionGroup(e,t,r,s){let i=new O(((c,l)=>c-l));const a=this.overlays.getIterator();for(;a.hasNext();){const c=a.getNext().value;if(c.getKey().getCollectionGroup()===t&&c.largestBatchId>r){let l=i.get(c.largestBatchId);l===null&&(l=Me(),i=i.insert(c.largestBatchId,l)),l.set(c.getKey(),c)}}const o=Me(),u=i.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach(((c,l)=>o.set(c,l))),!(o.size()>=s)););return p.resolve(o)}Zr(e,t,r){const s=this.overlays.get(r.key);if(s!==null){const a=this.Gs.get(s.largestBatchId).delete(r.key);this.Gs.set(s.largestBatchId,a)}this.overlays=this.overlays.insert(r.key,new wh(t,r));let i=this.Gs.get(t);i===void 0&&(i=x(),this.Gs.set(t,i)),this.Gs.set(t,i.add(r.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dh{constructor(){this.sessionToken=G.EMPTY_BYTE_STRING}getSessionToken(e){return p.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,p.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ts{constructor(){this.zs=new z(W.js),this.Hs=new z(W.Js)}isEmpty(){return this.zs.isEmpty()}addReference(e,t){const r=new W(e,t);this.zs=this.zs.add(r),this.Hs=this.Hs.add(r)}Ys(e,t){e.forEach((r=>this.addReference(r,t)))}removeReference(e,t){this.Zs(new W(e,t))}Xs(e,t){e.forEach((r=>this.removeReference(r,t)))}e_(e){const t=new A(new D([])),r=new W(t,e),s=new W(t,e+1),i=[];return this.Hs.forEachInRange([r,s],(a=>{this.Zs(a),i.push(a.key)})),i}t_(){this.zs.forEach((e=>this.Zs(e)))}Zs(e){this.zs=this.zs.delete(e),this.Hs=this.Hs.delete(e)}n_(e){const t=new A(new D([])),r=new W(t,e),s=new W(t,e+1);let i=x();return this.Hs.forEachInRange([r,s],(a=>{i=i.add(a.key)})),i}containsKey(e){const t=new W(e,0),r=this.zs.firstAfterOrEqual(t);return r!==null&&e.isEqual(r.key)}}class W{constructor(e,t){this.key=e,this.r_=t}static js(e,t){return A.comparator(e.key,t.key)||b(e.r_,t.r_)}static Js(e,t){return b(e.r_,t.r_)||A.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kh{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Gr=1,this.i_=new z(W.js)}checkEmpty(e){return p.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,r,s){const i=this.Gr;this.Gr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new yh(i,t,r,s);this.mutationQueue.push(a);for(const o of s)this.i_=this.i_.add(new W(o.key,i)),this.indexManager.addToCollectionParentIndex(e,o.key.path.popLast());return p.resolve(a)}lookupMutationBatch(e,t){return p.resolve(this.s_(t))}getNextMutationBatchAfterBatchId(e,t){const r=t+1,s=this.__(r),i=s<0?0:s;return p.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return p.resolve(this.mutationQueue.length===0?Kr:this.Gr-1)}getAllMutationBatches(e){return p.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const r=new W(t,0),s=new W(t,Number.POSITIVE_INFINITY),i=[];return this.i_.forEachInRange([r,s],(a=>{const o=this.s_(a.r_);i.push(o)})),p.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new z(b);return t.forEach((s=>{const i=new W(s,0),a=new W(s,Number.POSITIVE_INFINITY);this.i_.forEachInRange([i,a],(o=>{r=r.add(o.r_)}))})),p.resolve(this.o_(r))}getAllMutationBatchesAffectingQuery(e,t){const r=t.path,s=r.length+1;let i=r;A.isDocumentKey(i)||(i=i.child(""));const a=new W(new A(i),0);let o=new z(b);return this.i_.forEachWhile((u=>{const c=u.key.path;return!!r.isPrefixOf(c)&&(c.length===s&&(o=o.add(u.r_)),!0)}),a),p.resolve(this.o_(o))}o_(e){const t=[];return e.forEach((r=>{const s=this.s_(r);s!==null&&t.push(s)})),t}removeMutationBatch(e,t){I(this.a_(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let r=this.i_;return p.forEach(t.mutations,(s=>{const i=new W(s.key,t.batchId);return r=r.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)})).next((()=>{this.i_=r}))}Hr(e){}containsKey(e,t){const r=new W(t,0),s=this.i_.firstAfterOrEqual(r);return p.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,p.resolve()}a_(e,t){return this.__(e)}__(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}s_(e){const t=this.__(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lh{constructor(e){this.u_=e,this.docs=(function(){return new O(A.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const r=t.key,s=this.docs.get(r),i=s?s.size:0,a=this.u_(t);return this.docs=this.docs.insert(r,{document:t.mutableCopy(),size:a}),this.size+=a-i,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const r=this.docs.get(t);return p.resolve(r?r.document.mutableCopy():Z.newInvalidDocument(t))}getEntries(e,t){let r=se();return t.forEach((s=>{const i=this.docs.get(s);r=r.insert(s,i?i.document.mutableCopy():Z.newInvalidDocument(s))})),p.resolve(r)}getAllEntries(e){let t=se();return this.docs.forEach(((r,s)=>{t=t.insert(r,s.document)})),p.resolve(t)}getDocumentsMatchingQuery(e,t,r,s){let i,a;j(t)?(i=D.fromString(cr(t)),a=l=>dr(t,l)):(i=t.path,a=l=>er(t,l));let o=se();const u=new A(i.child("__id-9223372036854775808__")),c=this.docs.getIteratorFrom(u);for(;c.hasNext();){const{key:l,value:{document:h}}=c.getNext();if(!i.isPrefixOf(l.path))break;l.path.length>i.length+1||Su(Cu(h),r)<=0||(s.has(h.key)||a(h))&&(o=o.insert(h.key,h.mutableCopy()))}return p.resolve(o)}getAllFromCollectionGroup(e,t,r,s){V(9500)}c_(e,t){return p.forEach(this.docs,(r=>t(r)))}newChangeBuffer(e){return new Oh(this)}getSize(e){return p.resolve(this.size)}}class Oh extends Ch{constructor(e){super(),this.$s=e}applyChanges(e){const t=[];return this.changes.forEach(((r,s)=>{s.isValidDocument()?t.push(this.$s.addEntry(e,s)):this.$s.removeEntry(r)})),p.waitFor(t)}getFromCache(e,t){return this.$s.getEntry(e,t)}getAllFromCache(e,t){return this.$s.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mh{constructor(e){this.persistence=e,this.l_=new ct((t=>Xa(t)),Za),this.lastRemoteSnapshotVersion=P.min(),this.highestTargetId=0,this.E_=0,this.h_=new Ts,this.targetCount=0,this.T_=He.ws()}forEachTarget(e,t){return this.l_.forEach(((r,s)=>t(s))),p.resolve()}getLastRemoteSnapshotVersion(e){return p.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return p.resolve(this.E_)}allocateTargetId(e){return this.highestTargetId=this.T_.next(),p.resolve(this.highestTargetId)}setTargetsMetadata(e,t,r){return r&&(this.lastRemoteSnapshotVersion=r),t>this.E_&&(this.E_=t),p.resolve()}Ds(e){this.l_.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.T_=new He(t),this.highestTargetId=t),e.sequenceNumber>this.E_&&(this.E_=e.sequenceNumber)}addTargetData(e,t){return this.Ds(t),this.targetCount+=1,p.resolve()}updateTargetData(e,t){return this.Ds(t),p.resolve()}removeTargetData(e,t){return this.l_.delete(t.target),this.h_.e_(t.targetId),this.targetCount-=1,p.resolve()}removeTargets(e,t,r){let s=0;const i=[];return this.l_.forEach(((a,o)=>{o.sequenceNumber<=t&&r.get(o.targetId)===null&&(this.l_.delete(a),i.push(this.removeMatchingKeysForTargetId(e,o.targetId)),s++)})),p.waitFor(i).next((()=>s))}getTargetCount(e){return p.resolve(this.targetCount)}getTargetData(e,t){const r=this.l_.get(t)||null;return p.resolve(r)}addMatchingKeys(e,t,r){return this.h_.Ys(t,r),p.resolve()}removeMatchingKeys(e,t,r){this.h_.Xs(t,r);const s=this.persistence.referenceDelegate,i=[];return s&&t.forEach((a=>{i.push(s.markPotentiallyOrphaned(e,a))})),p.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.h_.e_(t),p.resolve()}getMatchingKeysForTargetId(e,t){const r=this.h_.n_(t);return p.resolve(r)}containsKey(e,t){return p.resolve(this.h_.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class no{constructor(e,t){this.P_={},this.overlays={},this.I_=new rr(0),this.R_=!1,this.R_=!0,this.A_=new Dh,this.referenceDelegate=e(this),this.V_=new Mh(this),this.indexManager=new Vh,this.remoteDocumentCache=(function(s){return new Lh(s)})((r=>this.referenceDelegate.d_(r))),this.serializer=new Ih(t),this.f_=new bh(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.R_=!1,Promise.resolve()}get started(){return this.R_}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new Nh,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let r=this.P_[e.toKey()];return r||(r=new kh(t,this.referenceDelegate),this.P_[e.toKey()]=r),r}getGlobalsCache(){return this.A_}getTargetCache(){return this.V_}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.f_}runTransaction(e,t,r){w("MemoryPersistence","Starting transaction:",e);const s=new Uh(this.I_.next());return this.referenceDelegate.m_(),r(s).next((i=>this.referenceDelegate.p_(s).next((()=>i)))).toPromise().then((i=>(s.raiseOnCommittedEvent(),i)))}g_(e,t){return p.or(Object.values(this.P_).map((r=>()=>r.containsKey(e,t))))}}class Uh extends xc{constructor(e){super(),this.currentSequenceNumber=e}}class Es{constructor(e){this.persistence=e,this.y_=new Ts,this.w_=null}static b_(e){return new Es(e)}get S_(){if(this.w_)return this.w_;throw V(60996)}addReference(e,t,r){return this.y_.addReference(r,t),this.S_.delete(r.toString()),p.resolve()}removeReference(e,t,r){return this.y_.removeReference(r,t),this.S_.add(r.toString()),p.resolve()}markPotentiallyOrphaned(e,t){return this.S_.add(t.toString()),p.resolve()}removeTarget(e,t){this.y_.e_(t.targetId).forEach((s=>this.S_.add(s.toString())));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,t.targetId).next((s=>{s.forEach((i=>this.S_.add(i.toString())))})).next((()=>r.removeTargetData(e,t)))}m_(){this.w_=new Set}p_(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return p.forEach(this.S_,(r=>{const s=A.fromPath(r);return this.v_(e,s).next((i=>{i||t.removeEntry(s,P.min())}))})).next((()=>(this.w_=null,t.apply(e))))}updateLimboDocument(e,t){return this.v_(e,t).next((r=>{r?this.S_.delete(t.toString()):this.S_.add(t.toString())}))}d_(e){return 0}v_(e,t){return p.or([()=>p.resolve(this.y_.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.g_(e,t)])}}class Gn{constructor(e,t){this.persistence=e,this.D_=new ct((r=>Th(r.path)),((r,s)=>r.isEqual(s))),this.garbageCollector=Oc(this,t)}static b_(e,t){return new Gn(e,t)}m_(){}p_(e){return p.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}ir(e){const t=this.Cs(e);return this.persistence.getTargetCache().getTargetCount(e).next((r=>t.next((s=>r+s))))}Cs(e){let t=0;return this.sr(e,(r=>{t++})).next((()=>t))}sr(e,t){return p.forEach(this.D_,((r,s)=>this.Os(e,r,s).next((i=>i?p.resolve():t(s)))))}removeTargets(e,t,r){return this.persistence.getTargetCache().removeTargets(e,t,r)}removeOrphanedDocuments(e,t){let r=0;const s=this.persistence.getRemoteDocumentCache(),i=s.newChangeBuffer();return s.c_(e,(a=>this.Os(e,a,t).next((o=>{o||(r++,i.removeEntry(a,P.min()))})))).next((()=>i.apply(e))).next((()=>r))}markPotentiallyOrphaned(e,t){return this.D_.set(t,e.currentSequenceNumber),p.resolve()}removeTarget(e,t){const r=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,r)}addReference(e,t,r){return this.D_.set(r,e.currentSequenceNumber),p.resolve()}removeReference(e,t,r){return this.D_.set(r,e.currentSequenceNumber),p.resolve()}updateLimboDocument(e,t){return this.D_.set(t,e.currentSequenceNumber),p.resolve()}d_(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=Pn(e.data.value)),t}Os(e,t,r){return p.or([()=>this.persistence.g_(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const s=this.D_.get(t);return p.resolve(s!==void 0&&s>r)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ws{constructor(e,t,r,s){this.targetId=e,this.fromCache=t,this.Vo=r,this.fo=s}static mo(e,t){let r=x(),s=x();for(const i of t.docChanges)switch(i.type){case 0:r=r.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new ws(e,t.fromCache,r,s)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fh(n,e){return A.comparator(n.key,e.key)}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qh{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bh{constructor(){this.po=!1,this.yo=!1,this.wo=100,this.bo=(function(){return qo()?8:bc(Bo())>0?6:4})()}initialize(e,t){this.So=e,this.indexManager=t,this.po=!0}getDocumentsMatchingQuery(e,t,r,s){const i={result:null};return this.vo(e,t).next((a=>{i.result=a})).next((()=>{if(!i.result)return this.Do(e,t,s,r).next((a=>{i.result=a}))})).next((()=>{if(i.result)return;const a=new qh;return this.xo(e,t,a).next((o=>{if(i.result=o,this.yo)return this.Co(e,t,a,o.size)}))})).next((()=>i.result))}Co(e,t,r,s){return j(t)?p.resolve():r.documentReadCount<this.wo?(mt()<=Se.DEBUG&&w("QueryEngine","SDK will not create cache indexes for query:",Qt(t),"since it only creates cache indexes for collection contains","more than or equal to",this.wo,"documents"),p.resolve()):(mt()<=Se.DEBUG&&w("QueryEngine","Query:",Qt(t),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.bo*s?(mt()<=Se.DEBUG&&w("QueryEngine","The SDK decides to create cache indexes for query:",Qt(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Ae(t))):p.resolve())}vo(e,t){if(j(t))return p.resolve(null);let r=t;if(ei(r))return p.resolve(null);let s=Ae(r);return this.indexManager.getIndexType(e,s).next((i=>i===0?null:(r.limit!==null&&i===1&&(r=Dr(r,null,"F"),s=Ae(r)),this.indexManager.getDocumentsMatchingTarget(e,s).next((a=>{const o=x(...a);return this.So.getDocuments(e,o).next((u=>this.indexManager.getMinOffset(e,s).next((c=>{const l=this.Fo(r,u);return this.Oo(r,l,o,c.readTime)?this.vo(e,Dr(r,null,"F")):this.Mo(e,l,r,c)}))))})))))}Do(e,t,r,s){return(j(t)?(function(a){for(const o of a.stages){if(o instanceof ut||o instanceof pi)return!1;if(o instanceof ur){if(o.condition instanceof Fa&&o.condition._expr.name==="exists"&&o.condition._expr.params[0]instanceof xt&&o.condition._expr.params[0].fieldName===we)continue;return!1}}return!0})(t):ei(t))||s.isEqual(P.min())?p.resolve(null):this.So.getDocuments(e,r).next((i=>{const a=this.Fo(t,i);return this.Oo(t,a,r,s)?p.resolve(null):(mt()<=Se.DEBUG&&w("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),gi(t)),this.Mo(e,a,t,Pu(s,sn)).next((o=>o)))}))}Fo(e,t){let r,s;return j(e)?(r=new z(Fh),s=i=>dr(e,i)):(r=new z(Zr(e)),s=i=>er(e,i)),t.forEach(((i,a)=>{s(a)&&(r=r.add(a))})),r}Oo(e,t,r,s){if(j(e))return(function(o){return o.stages.some((u=>u instanceof ut||u instanceof pi))})(e);if(e.limit===null)return!1;if(r.size!==t.size)return!0;const i=e.limitType==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}xo(e,t,r){return mt()<=Se.DEBUG&&w("QueryEngine","Using full collection scan to execute query:",gi(t)),this.So.getDocumentsMatchingQuery(e,t,Ge.min(),r)}Mo(e,t,r,s){return this.So.getDocumentsMatchingQuery(e,r,s).next((i=>(t.forEach((a=>{i=i.insert(a.key,a)})),i)))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Is="LocalStore",$h=3e8;class zh{constructor(e,t,r,s){this.persistence=e,this.No=t,this.serializer=s,this.Lo=new O(b),this.Bo=new ct((i=>Xa(i)),Za),this.Uo=new Map,this.ko=e.getRemoteDocumentCache(),this.V_=e.getTargetCache(),this.f_=e.getBundleCache(),this.qo(r)}qo(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new xh(this.ko,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.ko.setIndexManager(this.indexManager),this.No.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.Lo)))}}function Gh(n,e,t,r){return new zh(n,e,t,r)}async function ro(n,e){const t=C(n);return await t.persistence.runTransaction("Handle user change","readonly",(r=>{let s;return t.mutationQueue.getAllMutationBatches(r).next((i=>(s=i,t.qo(e),t.mutationQueue.getAllMutationBatches(r)))).next((i=>{const a=[],o=[];let u=x();for(const c of s){a.push(c.batchId);for(const l of c.mutations)u=u.add(l.key)}for(const c of i){o.push(c.batchId);for(const l of c.mutations)u=u.add(l.key)}return t.localDocuments.getDocuments(r,u).next((c=>({$o:c,removedBatchIds:a,addedBatchIds:o})))}))}))}function Qh(n,e){const t=C(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(r=>{const s=e.batch.keys(),i=t.ko.newChangeBuffer({trackRemovals:!0});return(function(o,u,c,l){const h=c.batch,m=h.keys();let g=p.resolve();return m.forEach((y=>{g=g.next((()=>l.getEntry(u,y))).next((S=>{const R=c.docVersions.get(y);I(R!==null,48541),S.version.compareTo(R)<0&&(h.applyToRemoteDocument(S,c),S.isValidDocument()&&(S.setReadTime(c.commitVersion),l.addEntry(S)))}))})),g.next((()=>o.mutationQueue.removeMutationBatch(u,h)))})(t,r,e,i).next((()=>i.apply(r))).next((()=>t.mutationQueue.performConsistencyCheck(r))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(r,s,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,(function(o){let u=x();for(let c=0;c<o.mutationResults.length;++c)o.mutationResults[c].transformResults.length>0&&(u=u.add(o.batch.mutations[c].key));return u})(e)))).next((()=>t.localDocuments.getDocuments(r,s)))}))}function so(n){const e=C(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.V_.getLastRemoteSnapshotVersion(t)))}function jh(n,e){const t=C(n),r=e.snapshotVersion;let s=t.Lo;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(i=>{const a=t.ko.newChangeBuffer({trackRemovals:!0});s=t.Lo;const o=[];e.targetChanges.forEach(((l,h)=>{const m=s.get(h);if(!m)return;o.push(t.V_.removeMatchingKeys(i,l.removedDocuments,h).next((()=>t.V_.addMatchingKeys(i,l.addedDocuments,h))));let g=m.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(h)!==null?g=g.withResumeToken(G.EMPTY_BYTE_STRING,P.min()).withLastLimboFreeSnapshotVersion(P.min()):l.resumeToken.approximateByteSize()>0&&(g=g.withResumeToken(l.resumeToken,r)),s=s.insert(h,g),(function(S,R,L){return S.resumeToken.approximateByteSize()===0||R.snapshotVersion.toMicroseconds()-S.snapshotVersion.toMicroseconds()>=$h?!0:L.addedDocuments.size+L.modifiedDocuments.size+L.removedDocuments.size>0})(m,g,l)&&o.push(t.V_.updateTargetData(i,g))}));let u=se(),c=x();if(e.documentUpdates.forEach((l=>{e.resolvedLimboDocuments.has(l)&&o.push(t.persistence.referenceDelegate.updateLimboDocument(i,l))})),o.push(Wh(i,a,e.documentUpdates).next((l=>{u=l.Ko,c=l.Qo}))),!r.isEqual(P.min())){const l=t.V_.getLastRemoteSnapshotVersion(i).next((h=>t.V_.setTargetsMetadata(i,i.currentSequenceNumber,r)));o.push(l)}return p.waitFor(o).next((()=>a.apply(i))).next((()=>t.localDocuments.getLocalViewOfDocuments(i,u,c))).next((()=>u))})).then((i=>(t.Lo=s,i)))}function Wh(n,e,t){let r=x(),s=x();return t.forEach((i=>r=r.add(i))),e.getEntries(n,r).next((i=>{let a=se();return t.forEach(((o,u)=>{const c=i.get(o);u.isFoundDocument()!==c.isFoundDocument()&&(s=s.add(o)),u.isNoDocument()&&u.version.isEqual(P.min())?(e.removeEntry(o,u.readTime),a=a.insert(o,u)):!c.isValidDocument()||u.version.compareTo(c.version)>0||u.version.compareTo(c.version)===0&&c.hasPendingWrites?(e.addEntry(u),a=a.insert(o,u)):w(Is,"Ignoring outdated watch update for ",o,". Current version:",c.version," Watch version:",u.version)})),{Ko:a,Qo:s}}))}function Kh(n,e){const t=C(n);return t.persistence.runTransaction("Get next mutation batch","readonly",(r=>(e===void 0&&(e=Kr),t.mutationQueue.getNextMutationBatchAfterBatchId(r,e))))}function Hh(n,e){const t=C(n);return t.persistence.runTransaction("Allocate target","readwrite",(r=>{let s;return t.V_.getTargetData(r,e).next((i=>i?(s=i,p.resolve(s)):t.V_.allocateTargetId(r).next((a=>(s=new be(e,a,"TargetPurposeListen",r.currentSequenceNumber),t.V_.addTargetData(r,s).next((()=>s)))))))})).then((r=>{const s=t.Lo.get(r.targetId);return(s===null||r.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.Lo=t.Lo.insert(r.targetId,r),t.Bo.set(e,r.targetId)),r}))}async function qr(n,e,t){const r=C(n),s=r.Lo.get(e),i=t?"readwrite":"readwrite-primary";try{t||await r.persistence.runTransaction("Release target",i,(a=>r.persistence.referenceDelegate.removeTarget(a,s)))}catch(a){if(!St(a))throw a;w(Is,`Failed to update sequence numbers for target ${e}: ${a}`)}r.Lo=r.Lo.remove(e),r.Bo.delete(s.target)}function Ti(n,e,t){const r=C(n);let s=P.min(),i=x();return r.persistence.runTransaction("Execute query","readwrite",(a=>(function(u,c,l){const h=C(u),m=h.Bo.get(l);return m!==void 0?p.resolve(h.Lo.get(m)):h.V_.getTargetData(c,l)})(r,a,j(e)?e:Ae(e)).next((o=>{if(o)return s=o.lastLimboFreeSnapshotVersion,r.V_.getMatchingKeysForTargetId(a,o.targetId).next((u=>{i=u}))})).next((()=>r.No.getDocumentsMatchingQuery(a,e,t?s:P.min(),t?i:x()))).next((o=>(Yh(r,o),{documents:o,Wo:i})))))}function Yh(n,e){e.forEach(((t,r)=>{const s=r.key.getCollectionGroup(),i=n.Uo.get(s)||P.min();r.readTime.compareTo(i)>0&&n.Uo.set(s,r.readTime)}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jh{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.Yo=0,this.Zo=null,this.Xo=!0}ea(){this.Yo===0&&(this.ta("Unknown"),this.Zo=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.Zo=null,this.na("Backend didn't respond within 10 seconds."),this.ta("Offline"),Promise.resolve()))))}ra(e){this.state==="Online"?this.ta("Unknown"):(this.Yo++,this.Yo>=1&&(this.ia(),this.na(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ta("Offline")))}set(e){this.ia(),this.Yo=0,e==="Online"&&(this.Xo=!1),this.ta(e)}ta(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}na(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.Xo?(ke(t),this.Xo=!1):w("OnlineStateTracker",t)}ia(){this.Zo!==null&&(this.Zo.cancel(),this.Zo=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ce="RemoteStore";class Xh{constructor(e,t,r,s,i){this.localStore=e,this.datastore=t,this.asyncQueue=r,this.remoteSyncer={},this.sa=[],this._a=new Map,this.oa=new Map,this.aa=new Map,this.ua=new He(1e3),this.ca=new He(1001),this.la=new Set,this.Ea=[],this.ha=i,this.ha.Qe((a=>{r.enqueueAndForget((async()=>{dt(this)&&(w(Ce,"Restarting streams for network reachability change."),await(async function(u){const c=C(u);c.la.add(4),await Tn(c),c.Ta.set("Unknown"),c.la.delete(4),await mr(c)})(this))}))})),this.Ta=new Jh(r,s)}}async function mr(n){if(dt(n))for(const e of n.Ea)await e(!0)}async function Tn(n){for(const e of n.Ea)await e(!1)}function Br(n,e){return n.oa.get(e)||void 0}function io(n,e){const t=C(n),r=Br(t,e.targetId);if(r!==void 0&&t._a.has(r))return;const s=(function(o,u){const c=Br(o,u);c!==void 0&&o.aa.delete(c);const l=(function(m,g){return g%2!=0?m.ca.next():m.ua.next()})(o,u);return o.oa.set(u,l),o.aa.set(l,u),l})(t,e.targetId);w(Ce,"remoteStoreListen mapping SDK target ID to remote",e.targetId,s);const i=new be(e.target,s,e.purpose,e.sequenceNumber,e.snapshotVersion,e.lastLimboFreeSnapshotVersion,e.resumeToken);t._a.set(s,i),Rs(t)?vs(t):kt(t).Yt()&&Vs(t,i)}function As(n,e){const t=C(n),r=kt(t),s=Br(t,e);w(Ce,"remoteStoreUnlisten removing mapping of SDK target ID to remote",e,s),t._a.delete(s),t.oa.delete(e),t.aa.delete(s),r.Yt()&&ao(t,s),t._a.size===0&&(r.Yt()?r.en():dt(t)&&t.Ta.set("Unknown"))}function Vs(n,e){if(n.Pa.J(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(P.min())>0){const t=n.aa.get(e.targetId);if(t===void 0)return void w(Ce,"SDK target ID not found for remote ID: "+e.targetId);const r=n.remoteSyncer.getRemoteKeysForTarget(t).size;e=e.withExpectedCount(r)}kt(n).Pn(e)}function ao(n,e){n.Pa.J(e),kt(n).In(e)}function vs(n){n.Pa=new ju({getRemoteKeysForTarget:e=>{const t=n.aa.get(e);return t!==void 0?n.remoteSyncer.getRemoteKeysForTarget(t):x()},ye:e=>n._a.get(e)||null,Ve:()=>n.datastore.serializer.databaseId}),kt(n).start(),n.Ta.ea()}function Rs(n){return dt(n)&&!kt(n).Jt()&&n._a.size>0}function dt(n){return C(n).la.size===0}function oo(n){n.Pa=void 0}async function Zh(n){n.Ta.set("Online")}async function ed(n){n._a.forEach(((e,t)=>{Vs(n,e)}))}async function td(n,e){oo(n),Rs(n)?(n.Ta.ra(e),vs(n)):n.Ta.set("Unknown")}async function nd(n,e,t){if(n.Ta.set("Online"),e instanceof ma&&e.state===2&&e.cause)try{await(async function(s,i){const a=i.cause;for(const o of i.targetIds){if(s._a.has(o)){const u=s.aa.get(o);u!==void 0&&(await s.remoteSyncer.rejectListen(u,a),s.oa.delete(u),s.aa.delete(o)),s._a.delete(o)}s.Pa.removeTarget(o)}})(n,e)}catch(r){w(Ce,"Failed to remove targets %s: %s ",e.targetIds.join(","),r),await Qn(n,r)}else if(e instanceof Sn?n.Pa._e(e):e instanceof da?n.Pa.he(e):n.Pa.ue(e),!t.isEqual(P.min()))try{const r=await so(n.localStore);t.compareTo(r)>=0&&await(function(i,a){const o=i.Pa.fe(a);o.targetChanges.forEach(((c,l)=>{if(c.resumeToken.approximateByteSize()>0){const h=i._a.get(l);h&&i._a.set(l,h.withResumeToken(c.resumeToken,a))}})),o.targetMismatches.forEach(((c,l)=>{const h=i._a.get(c);if(!h)return;i._a.set(c,h.withResumeToken(G.EMPTY_BYTE_STRING,h.snapshotVersion)),ao(i,c);const m=new be(h.target,c,l,h.sequenceNumber);Vs(i,m)}));const u=(function(l,h){const m=new Map;h.targetChanges.forEach(((y,S)=>{const R=l.aa.get(S);R!==void 0&&m.set(R,y)}));let g=new O(b);return h.targetMismatches.forEach(((y,S)=>{const R=l.aa.get(y);R!==void 0&&(g=g.insert(R,S))})),new pn(h.snapshotVersion,m,g,h.documentUpdates,h.augmentedDocumentUpdates,h.resolvedLimboDocuments)})(i,o);return i.remoteSyncer.applyRemoteEvent(u)})(n,t)}catch(r){w(Ce,"Failed to raise snapshot:",r),await Qn(n,r)}}async function Qn(n,e,t){if(!St(e))throw e;n.la.add(1),await Tn(n),n.Ta.set("Offline"),t||(t=()=>so(n.localStore)),n.asyncQueue.enqueueRetryable((async()=>{w(Ce,"Retrying IndexedDB access"),await t(),n.la.delete(1),await mr(n)}))}function uo(n,e){return e().catch((t=>Qn(n,t,e)))}async function fr(n){const e=C(n),t=Ye(e);let r=e.sa.length>0?e.sa[e.sa.length-1].batchId:Kr;for(;rd(e);)try{const s=await Kh(e.localStore,r);if(s===null){e.sa.length===0&&t.en();break}r=s.batchId,sd(e,s)}catch(s){await Qn(e,s)}co(e)&&lo(e)}function rd(n){return dt(n)&&n.sa.length<10}function sd(n,e){n.sa.push(e);const t=Ye(n);t.Yt()&&t.Rn&&t.An(e.mutations)}function co(n){return dt(n)&&!Ye(n).Jt()&&n.sa.length>0}function lo(n){Ye(n).start()}async function id(n){Ye(n).fn()}async function ad(n){const e=Ye(n);for(const t of n.sa)e.An(t.mutations)}async function od(n,e,t){const r=n.sa.shift(),s=ys.from(r,e,t);await uo(n,(()=>n.remoteSyncer.applySuccessfulWrite(s))),await fr(n)}async function ud(n,e){e&&Ye(n).Rn&&await(async function(r,s){if((function(a){return Uu(a)&&a!==_.ABORTED})(s.code)){const i=r.sa.shift();Ye(r).Xt(),await uo(r,(()=>r.remoteSyncer.rejectFailedWrite(i.batchId,s))),await fr(r)}})(n,e),co(n)&&lo(n)}async function Ei(n,e){const t=C(n);t.asyncQueue.verifyOperationInProgress(),w(Ce,"RemoteStore received new credentials");const r=dt(t);t.la.add(3),await Tn(t),r&&t.Ta.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.la.delete(3),await mr(t)}async function cd(n,e){const t=C(n);e?(t.la.delete(2),await mr(t)):e||(t.la.add(2),await Tn(t),t.Ta.set("Unknown"))}function kt(n){return n.Ia||(n.Ia=(function(t,r,s){const i=C(t);return i.pn(),new Ic(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(n.datastore,n.asyncQueue,{ct:Zh.bind(null,n),Et:ed.bind(null,n),Tt:td.bind(null,n),Tn:nd.bind(null,n)}),n.Ea.push((async e=>{e?(n.Ia.Xt(),Rs(n)?vs(n):n.Ta.set("Unknown")):(await n.Ia.stop(),oo(n))}))),n.Ia}function Ye(n){return n.Ra||(n.Ra=(function(t,r,s){const i=C(t);return i.pn(),new Ac(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(n.datastore,n.asyncQueue,{ct:()=>Promise.resolve(),Et:id.bind(null,n),Tt:ud.bind(null,n),Vn:ad.bind(null,n),dn:od.bind(null,n)}),n.Ea.push((async e=>{e?(n.Ra.Xt(),await fr(n)):(await n.Ra.stop(),n.sa.length>0&&(w(Ce,`Stopping write stream with ${n.sa.length} pending writes`),n.sa=[]))}))),n.Ra}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ho{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Aa(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Aa(this.observer.error,e):ke("Uncaught Error in snapshot listener:",e.toString()))}Va(){this.muted=!0}Aa(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ps{constructor(e,t,r,s,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=s,this.removalCallback=i,this.deferred=new Ne,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((a=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,s,i){const a=Date.now()+r,o=new Ps(e,t,a,s,i);return o.start(r),o}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new E(_.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Cs(n,e){if(ke("AsyncQueue",`${e}: ${n}`),St(n))return new E(_.UNAVAILABLE,`${e}: ${n}`);throw n}class wi{constructor(){this.activeTargetIds=zu()}Ba(e){this.activeTargetIds=this.activeTargetIds.add(e)}Ua(e){this.activeTargetIds=this.activeTargetIds.delete(e)}La(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class ld{constructor(){this.fu=new wi,this.mu={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,r){}addLocalQueryTarget(e,t=!0){return t&&this.fu.Ba(e),this.mu[e]||"not-current"}updateQueryState(e,t,r){this.mu[e]=t}removeLocalQueryTarget(e){this.fu.Ua(e)}isLocalQueryTarget(e){return this.fu.activeTargetIds.has(e)}clearQueryState(e){delete this.mu[e]}getAllActiveQueryTargets(){return this.fu.activeTargetIds}isActiveQueryTarget(e){return this.fu.activeTargetIds.has(e)}start(){return this.fu=new wi,Promise.resolve()}handleUserChange(e,t,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}function vr(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class it{static emptySet(e){return new it(e.comparator)}constructor(e){this.comparator=e?(t,r)=>e(t,r)||A.comparator(t.key,r.key):(t,r)=>A.comparator(t.key,r.key),this.keyedMap=_t(),this.sortedSet=new O(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,r)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof it)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=r.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const r=new it;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=t,r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ii{constructor(){this.pu=new O(A.comparator)}track(e){const t=e.doc.key,r=this.pu.get(t);r?e.type!==0&&r.type===3?this.pu=this.pu.insert(t,e):e.type===3&&r.type!==1?this.pu=this.pu.insert(t,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.pu=this.pu.insert(t,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.pu=this.pu.insert(t,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.pu=this.pu.remove(t):e.type===1&&r.type===2?this.pu=this.pu.insert(t,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.pu=this.pu.insert(t,{type:2,doc:e.doc}):V(63341,{we:e,gu:r}):this.pu=this.pu.insert(t,e)}yu(){const e=[];return this.pu.inorderTraversal(((t,r)=>{e.push(r)})),e}}class vt{constructor(e,t,r,s,i,a,o,u,c){this.query=e,this.docs=t,this.oldDocs=r,this.docChanges=s,this.mutatedKeys=i,this.fromCache=a,this.syncStateChanged=o,this.excludesMetadataChanges=u,this.hasCachedResults=c}static fromInitialDocuments(e,t,r,s,i){const a=[];return t.forEach((o=>{a.push({type:0,doc:o})})),new vt(e,t,it.emptySet(t),a,r,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&hr(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,r=e.docChanges;if(t.length!==r.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==r[s].type||!t[s].doc.isEqual(r[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hd{constructor(){this.wu=void 0,this.bu=[]}Su(){return this.bu.some((e=>e.vu()))}}class dd{constructor(){this.queries=Ai(),this.onlineState="Unknown",this.Du=new Set}terminate(){(function(t,r){const s=C(t),i=s.queries;s.queries=Ai(),i.forEach(((a,o)=>{for(const u of o.bu)u.onError(r)}))})(this,new E(_.ABORTED,"Firestore shutting down"))}}function Ai(){return new ct((n=>Ja(n)),hr)}async function mo(n,e){const t=C(n);let r=3;const s=e.query;let i=t.queries.get(s);i?!i.Su()&&e.vu()&&(r=2):(i=new hd,r=e.vu()?0:1);try{switch(r){case 0:i.wu=await t.onListen(s,!0);break;case 1:i.wu=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(a){const o=Cs(a,`Initialization of query '${j(e.query)?De(e.query):Qt(e.query)}' failed`);return void e.onError(o)}t.queries.set(s,i),i.bu.push(e),e.xu(t.onlineState),i.wu&&e.Cu(i.wu)&&Ss(t)}async function fo(n,e){const t=C(n),r=e.query;let s=3;const i=t.queries.get(r);if(i){const a=i.bu.indexOf(e);a>=0&&(i.bu.splice(a,1),i.bu.length===0?s=e.vu()?0:1:!i.Su()&&e.vu()&&(s=2))}switch(s){case 0:return t.queries.delete(r),t.onUnlisten(r,!0);case 1:return t.queries.delete(r),t.onUnlisten(r,!1);case 2:return t.onLastRemoteStoreUnlisten(r);default:return}}function md(n,e){const t=C(n);let r=!1;for(const s of e){const i=s.query,a=t.queries.get(i);if(a){for(const o of a.bu)o.Cu(s)&&(r=!0);a.wu=s}}r&&Ss(t)}function fd(n,e,t){const r=C(n),s=r.queries.get(e);if(s)for(const i of s.bu)i.onError(t);r.queries.delete(e)}function Ss(n){n.Du.forEach((e=>{e.next()}))}var $r;(function(n){n.Default="default",n.Cache="cache"})($r||($r={}));class _o{constructor(e,t,r){this.query=e,this.Fu=t,this.Ou=!1,this.Mu=null,this.onlineState="Unknown",this.options=r||{}}Cu(e){if(!this.options.includeMetadataChanges){const r=[];for(const s of e.docChanges)s.type!==3&&r.push(s);e=new vt(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.Ou?this.Nu(e)&&(this.Fu.next(e),t=!0):this.Lu(e,this.onlineState)&&(this.Bu(e),t=!0),this.Mu=e,t}onError(e){this.Fu.error(e)}xu(e){this.onlineState=e;let t=!1;return this.Mu&&!this.Ou&&this.Lu(this.Mu,e)&&(this.Bu(this.Mu),t=!0),t}Lu(e,t){if(!e.fromCache||!this.vu())return!0;const r=t!=="Offline";return(!this.options.waitForSyncWhenOnline||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Nu(e){if(e.docChanges.length>0)return!0;const t=this.Mu&&this.Mu.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}Bu(e){e=vt.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Ou=!0,this.Fu.next(e)}vu(){return this.options.source!==$r.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class po{constructor(e){this.key=e}}class go{constructor(e){this.key=e}}class _d{constructor(e,t){this.query=e,this.zu=t,this.ju=null,this.hasCachedResults=!1,this.current=!1,this.Hu=x(),this.mutatedKeys=x(),this.Ju=j(e)?Fr(e):Zr(e),this.Yu=new it(this.Ju)}get Zu(){return this.zu}Xu(e,t){const r=t?t.ec:new Ii,s=t?t.Yu:this.Yu;let i=t?t.mutatedKeys:this.mutatedKeys,a=s,o=!1;const[u,c]=this.tc(this.query,s);e.inorderTraversal(((h,m)=>{const g=s.get(h),y=Rh(this.query,m)?m:null,S=!!g&&this.mutatedKeys.has(g.key),R=!!y&&(y.hasLocalMutations||this.mutatedKeys.has(y.key)&&y.hasCommittedMutations);let L=!1;g&&y?g.data.isEqual(y.data)?S!==R&&(r.track({type:3,doc:y}),L=!0):this.nc(g,y)||(r.track({type:2,doc:y}),L=!0,(u&&this.Ju(y,u)>0||c&&this.Ju(y,c)<0)&&(o=!0)):!g&&y?(r.track({type:0,doc:y}),L=!0):g&&!y&&(r.track({type:1,doc:g}),L=!0,(u||c)&&(o=!0)),L&&(y?(a=a.add(y),i=R?i.add(h):i.delete(h)):(a=a.delete(h),i=i.delete(h)))}));const l=this.rc(this.query);if(l)if(j(this.query)){const h=[];a.forEach((y=>h.push(y)));const m=to(this.query,h);let g=new it(Fr(this.query));for(const y of m)g=g.add(y);a.forEach((y=>{g.has(y.key)||(i=i.delete(y.key),r.track({type:1,doc:y}))})),a=g}else{const h=this.sc(this.query);for(;a.size>l;){const m=h==="F"?a.last():a.first();a=a.delete(m.key),i=i.delete(m.key),r.track({type:1,doc:m})}}return{Yu:a,ec:r,Oo:o,mutatedKeys:i}}rc(e){var t;return j(e)?(t=Vr(e))==null?void 0:t.limit:e.limit||void 0}sc(e){if(j(e)){const t=Vr(e);return t&&t.limit<0?"L":"F"}return e.limitType}tc(e,t){var r;if(j(e)){const s=(r=Vr(e))==null?void 0:r.limit;return[t.size===s?t.last():null,null]}return[e.limitType==="F"&&t.size===this.rc(this.query)?t.last():null,e.limitType==="L"&&t.size===this.rc(this.query)?t.first():null]}nc(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,r,s){const i=this.Yu;this.Yu=e.Yu,this.mutatedKeys=e.mutatedKeys;const a=e.ec.yu();a.sort(((l,h)=>(function(g,y){const S=R=>{switch(R){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return V(20277,{we:R})}};return S(g)-S(y)})(l.type,h.type)||this.Ju(l.doc,h.doc))),this._c(r),s=s??!1;const o=t&&!s?this.oc():[],u=this.Hu.size===0&&this.current&&!s?1:0,c=u!==this.ju;return this.ju=u,a.length!==0||c?{snapshot:new vt(this.query,e.Yu,i,a,e.mutatedKeys,u===0,c,!1,!!r&&r.resumeToken.approximateByteSize()>0),ac:o}:{ac:o}}xu(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Yu:this.Yu,ec:new Ii,mutatedKeys:this.mutatedKeys,Oo:!1},!1)):{ac:[]}}uc(e){return!this.zu.has(e)&&!!this.Yu.has(e)&&!this.Yu.get(e).hasLocalMutations}_c(e){e&&(e.addedDocuments.forEach((t=>this.zu=this.zu.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.zu=this.zu.delete(t))),this.current=e.current)}oc(){if(!this.current)return[];const e=this.Hu;this.Hu=x(),this.Yu.forEach((r=>{this.uc(r.key)&&(this.Hu=this.Hu.add(r.key))}));const t=[];return e.forEach((r=>{this.Hu.has(r)||t.push(new go(r))})),this.Hu.forEach((r=>{e.has(r)||t.push(new po(r))})),t}cc(e){this.zu=e.Wo,this.Hu=x();const t=this.Xu(e.documents);return this.applyChanges(t,!0)}lc(){return vt.fromInitialDocuments(this.query,this.Yu,this.mutatedKeys,this.ju===0,this.hasCachedResults)}}const xs="SyncEngine";class pd{constructor(e,t,r){this.query=e,this.targetId=t,this.view=r}}class gd{constructor(e){this.key=e,this.Ec=!1}}class yd{constructor(e,t,r,s,i,a){this.localStore=e,this.remoteStore=t,this.eventManager=r,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=a,this.hc={},this.Tc=new ct((o=>Ja(o)),hr),this.Pc=new Map,this.Ic=new Set,this.Rc=new O(A.comparator),this.Ac=new Map,this.Vc=new Ts,this.dc={},this.fc=new Map,this.mc=He.bs(),this.onlineState="Unknown",this.gc=void 0}get isPrimaryClient(){return this.gc===!0}}async function Td(n,e,t=!0){const r=Ao(n);let s;const i=r.Tc.get(e);return i?(r.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.lc()):s=await yo(r,e,t,!0),s}async function Ed(n,e){const t=Ao(n);await yo(t,e,!0,!1)}async function yo(n,e,t,r){const s=await Hh(n.localStore,j(e)?e:Ae(e)),i=s.targetId,a=n.sharedClientState.addLocalQueryTarget(i,t);let o;return r&&(o=await wd(n,e,i,a==="current",s.resumeToken)),n.isPrimaryClient&&t&&io(n.remoteStore,s),o}async function wd(n,e,t,r,s){n.yc=(h,m,g)=>(async function(S,R,L,U){let ce=R.view.Xu(L);ce.Oo&&(ce=await Ti(S.localStore,R.query,!1).then((({documents:yr})=>R.view.Xu(yr,ce))));const Ot=U&&U.targetChanges.get(R.targetId),et=U&&U.targetMismatches.get(R.targetId)!=null,gr=R.view.applyChanges(ce,S.isPrimaryClient,Ot,et);return vi(S,R.targetId,gr.ac),gr.snapshot})(n,h,m,g);const i=await Ti(n.localStore,e,!0),a=new _d(e,i.Wo),o=a.Xu(i.documents),u=gn.createSynthesizedTargetChangeForCurrentChange(t,r&&n.onlineState!=="Offline",s),c=a.applyChanges(o,n.isPrimaryClient,u);vi(n,t,c.ac);const l=new pd(e,t,a);return n.Tc.set(e,l),n.Pc.has(t)?n.Pc.get(t).push(e):n.Pc.set(t,[e]),c.snapshot}async function Id(n,e,t){const r=C(n),s=r.Tc.get(e),i=r.Pc.get(s.targetId);if(i.length>1)return r.Pc.set(s.targetId,i.filter((a=>!hr(a,e)))),void r.Tc.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await qr(r.localStore,s.targetId,!1).then((()=>{r.sharedClientState.clearQueryState(s.targetId),t&&As(r.remoteStore,s.targetId),zr(r,s.targetId)})).catch(Ct)):(zr(r,s.targetId),await qr(r.localStore,s.targetId,!0))}async function Ad(n,e){const t=C(n),r=t.Tc.get(e),s=t.Pc.get(r.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(r.targetId),As(t.remoteStore,r.targetId))}async function Vd(n,e,t){const r=bd(n);try{const s=await(function(a,o){const u=C(a),c=k.now(),l=o.reduce(((g,y)=>g.add(y.key)),x());let h,m;return u.persistence.runTransaction("Locally write mutations","readwrite",(g=>{let y=se(),S=x();return u.ko.getEntries(g,l).next((R=>{y=R,y.forEach(((L,U)=>{U.isValidDocument()||(S=S.add(L))}))})).next((()=>u.localDocuments.getOverlayedDocuments(g,y))).next((R=>{h=R;const L=[];for(const U of o){const ce=pu(U,h.get(U.key).overlayedDocument);ce!=null&&L.push(new Ze(U.key,ce,Qi(ce.value.mapValue),fe.exists(!0)))}return u.mutationQueue.addMutationBatch(g,c,L,o)})).next((R=>{m=R;const L=R.applyToLocalDocumentSet(h,S);return u.documentOverlayCache.saveOverlays(g,R.batchId,L)}))})).then((()=>({batchId:m.batchId,changes:la(h)})))})(r.localStore,e);r.sharedClientState.addPendingMutation(s.batchId),(function(a,o,u){let c=a.dc[a.currentUser.toKey()];c||(c=new O(b)),c=c.insert(o,u),a.dc[a.currentUser.toKey()]=c})(r,s.batchId,t),await En(r,s.changes),await fr(r.remoteStore)}catch(s){const i=Cs(s,"Failed to persist write");t.reject(i)}}async function To(n,e){const t=C(n);try{const r=await jh(t.localStore,e);e.targetChanges.forEach(((s,i)=>{const a=t.Ac.get(i);a&&(I(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?a.Ec=!0:s.modifiedDocuments.size>0?I(a.Ec,14607):s.removedDocuments.size>0&&(I(a.Ec,42227),a.Ec=!1))})),await En(t,r,e)}catch(r){await Ct(r)}}function Vi(n,e,t){const r=C(n);if(r.isPrimaryClient&&t===0||!r.isPrimaryClient&&t===1){const s=[];r.Tc.forEach(((i,a)=>{const o=a.view.xu(e);o.snapshot&&s.push(o.snapshot)})),(function(a,o){const u=C(a);u.onlineState=o;let c=!1;u.queries.forEach(((l,h)=>{for(const m of h.bu)m.xu(o)&&(c=!0)})),c&&Ss(u)})(r.eventManager,e),s.length&&r.hc.Tn(s),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function vd(n,e,t){const r=C(n);r.sharedClientState.updateQueryState(e,"rejected",t);const s=r.Ac.get(e),i=s&&s.key;if(i){let a=new O(A.comparator);a=a.insert(i,Z.newNoDocument(i,P.min()));const o=x().add(i),u=new pn(P.min(),new Map,new O(b),a,se(),o);await To(r,u),r.Rc=r.Rc.remove(i),r.Ac.delete(e),bs(r)}else await qr(r.localStore,e,!1).then((()=>zr(r,e,t))).catch(Ct)}async function Rd(n,e){const t=C(n),r=e.batch.batchId;try{const s=await Qh(t.localStore,e);wo(t,r,null),Eo(t,r),t.sharedClientState.updateMutationState(r,"acknowledged"),await En(t,s)}catch(s){await Ct(s)}}async function Pd(n,e,t){const r=C(n);try{const s=await(function(a,o){const u=C(a);return u.persistence.runTransaction("Reject batch","readwrite-primary",(c=>{let l;return u.mutationQueue.lookupMutationBatch(c,o).next((h=>(I(h!==null,37113),l=h.keys(),u.mutationQueue.removeMutationBatch(c,h)))).next((()=>u.mutationQueue.performConsistencyCheck(c))).next((()=>u.documentOverlayCache.removeOverlaysForBatchId(c,l,o))).next((()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(c,l))).next((()=>u.localDocuments.getDocuments(c,l)))}))})(r.localStore,e);wo(r,e,t),Eo(r,e),r.sharedClientState.updateMutationState(e,"rejected",t),await En(r,s)}catch(s){await Ct(s)}}function Eo(n,e){(n.fc.get(e)||[]).forEach((t=>{t.resolve()})),n.fc.delete(e)}function wo(n,e,t){const r=C(n);let s=r.dc[r.currentUser.toKey()];if(s){const i=s.get(e);i&&(t?i.reject(t):i.resolve(),s=s.remove(e)),r.dc[r.currentUser.toKey()]=s}}function zr(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const r of n.Pc.get(e))n.Tc.delete(r),t&&n.hc.wc(r,t);n.Pc.delete(e),n.isPrimaryClient&&n.Vc.e_(e).forEach((r=>{n.Vc.containsKey(r)||Io(n,r)}))}function Io(n,e){n.Ic.delete(e.path.canonicalString());const t=n.Rc.get(e);t!==null&&(As(n.remoteStore,t),n.Rc=n.Rc.remove(e),n.Ac.delete(t),bs(n))}function vi(n,e,t){for(const r of t)r instanceof po?(n.Vc.addReference(r.key,e),Cd(n,r)):r instanceof go?(w(xs,"Document no longer in limbo: "+r.key),n.Vc.removeReference(r.key,e),n.Vc.containsKey(r.key)||Io(n,r.key)):V(19791,{bc:r})}function Cd(n,e){const t=e.key,r=t.path.canonicalString();n.Rc.get(t)||n.Ic.has(r)||(w(xs,"New document in limbo: "+t),n.Ic.add(r),bs(n))}function bs(n){for(;n.Ic.size>0&&n.Rc.size<n.maxConcurrentLimboResolutions;){const e=n.Ic.values().next().value;n.Ic.delete(e);const t=new A(D.fromString(e)),r=n.mc.next();n.Ac.set(r,new gd(t)),n.Rc=n.Rc.insert(t,r),io(n.remoteStore,new be(Ae(Xr(t.path)),r,"TargetPurposeLimboResolution",rr.wn))}}async function En(n,e,t){const r=C(n),s=[],i=[],a=[];r.Tc.isEmpty()||(r.Tc.forEach(((o,u)=>{a.push(r.yc(u,e,t).then((c=>{var l;if((c||t)&&r.isPrimaryClient){const h=c?!c.fromCache:(l=t==null?void 0:t.targetChanges.get(u.targetId))==null?void 0:l.current;r.sharedClientState.updateQueryState(u.targetId,h?"current":"not-current")}if(c){s.push(c);const h=ws.mo(u.targetId,c);i.push(h)}})))})),await Promise.all(a),r.hc.Tn(s),await(async function(u,c){const l=C(u);try{await l.persistence.runTransaction("notifyLocalViewChanges","readwrite",(h=>p.forEach(c,(m=>p.forEach(m.Vo,(g=>l.persistence.referenceDelegate.addReference(h,m.targetId,g))).next((()=>p.forEach(m.fo,(g=>l.persistence.referenceDelegate.removeReference(h,m.targetId,g)))))))))}catch(h){if(!St(h))throw h;w(Is,"Failed to update sequence numbers: "+h)}for(const h of c){const m=h.targetId;if(!h.fromCache){const g=l.Lo.get(m),y=g.snapshotVersion,S=g.withLastLimboFreeSnapshotVersion(y);l.Lo=l.Lo.insert(m,S)}}})(r.localStore,i))}async function Sd(n,e){const t=C(n);if(!t.currentUser.isEqual(e)){w(xs,"User change. New user:",e.toKey());const r=await ro(t.localStore,e);t.currentUser=e,(function(i,a){i.fc.forEach((o=>{o.forEach((u=>{u.reject(new E(_.CANCELLED,a))}))})),i.fc.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await En(t,r.$o)}}function xd(n,e){const t=C(n),r=t.Ac.get(e);if(r&&r.Ec)return x().add(r.key);{let s=x();const i=t.Pc.get(e);if(!i)return s;for(const a of i??[]){const o=t.Tc.get(a);s=s.unionWith(o.view.Zu)}return s}}function Ao(n){const e=C(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=To.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=xd.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=vd.bind(null,e),e.hc.Tn=md.bind(null,e.eventManager),e.hc.wc=fd.bind(null,e.eventManager),e}function bd(n){const e=C(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=Rd.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=Pd.bind(null,e),e}class jn{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=tr(e.databaseInfo.databaseId),this.sharedClientState=this.vc(e),this.persistence=this.Dc(e),await this.persistence.start(),this.localStore=this.xc(e),this.gcScheduler=this.Cc(e,this.localStore),this.indexBackfillerScheduler=this.Fc(e,this.localStore)}Cc(e,t){return null}Fc(e,t){return null}xc(e){return Gh(this.persistence,new Bh,e.initialUser,this.serializer)}Dc(e){return new no(Es.b_,this.serializer)}vc(e){return new ld}async terminate(){var e,t;(e=this.gcScheduler)==null||e.stop(),(t=this.indexBackfillerScheduler)==null||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}jn.provider={build:()=>new jn};class Nd extends jn{constructor(e){super(),this.cacheSizeBytes=e}Cc(e,t){I(this.persistence.referenceDelegate instanceof Gn,46915);const r=this.persistence.referenceDelegate.garbageCollector;return new kc(r,e.asyncQueue,t)}Dc(e){const t=this.cacheSizeBytes!==void 0?re.withCacheSize(this.cacheSizeBytes):re.DEFAULT;return new no((r=>Gn.b_(r,t)),this.serializer)}}class Gr{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>Vi(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=Sd.bind(null,this.syncEngine),await cd(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new dd})()}createDatastore(e){const t=tr(e.databaseInfo.databaseId),r=wc(e.databaseInfo);return Rc(e.authCredentials,e.appCheckCredentials,r,t)}createRemoteStore(e){return(function(r,s,i,a,o){return new Xh(r,s,i,a,o)})(this.localStore,this.datastore,e.asyncQueue,(t=>Vi(this.syncEngine,t,0)),(function(){return ui.Ye()?new ui:new gc})())}createSyncEngine(e,t){return(function(s,i,a,o,u,c,l){const h=new yd(s,i,a,o,u,c);return l&&(h.gc=!0),h})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await(async function(s){const i=C(s);w(Ce,"RemoteStore shutting down."),i.la.add(5),await Tn(i),i.ha.shutdown(),i.Ta.set("Unknown")})(this.remoteStore),(e=this.datastore)==null||e.terminate(),(t=this.eventManager)==null||t.terminate()}}Gr.provider={build:()=>new Gr};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Je="FirestoreClient";class Dd{constructor(e,t,r,s,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=r,this._databaseInfo=s,this.user=X.UNAUTHENTICATED,this.clientId=Wr.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(r,(async a=>{w(Je,"Received user=",a.uid),await this.authCredentialListener(a),this.user=a})),this.appCheckCredentials.start(r,(a=>(w(Je,"Received new app check token=",a),this.appCheckCredentialListener(a,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Ne;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const r=Cs(t,"Failed to shutdown persistence");e.reject(r)}})),e.promise}}async function Rr(n,e){n.asyncQueue.verifyOperationInProgress(),w(Je,"Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let r=t.initialUser;n.setCredentialChangeListener((async s=>{r.isEqual(s)||(await ro(e.localStore,s),r=s)})),e.persistence.setDatabaseDeletedListener((()=>n.terminate())),n._offlineComponents=e}async function Ri(n,e){n.asyncQueue.verifyOperationInProgress();const t=await kd(n);w(Je,"Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener((r=>Ei(e.remoteStore,r))),n.setAppCheckTokenChangeListener(((r,s)=>Ei(e.remoteStore,s))),n._onlineComponents=e}async function kd(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){w(Je,"Using user provided OfflineComponentProvider");try{await Rr(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(s){return s.name==="FirebaseError"?s.code===_.FAILED_PRECONDITION||s.code===_.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11})(t))throw t;ye("Error using user provided cache. Falling back to memory cache: "+t),await Rr(n,new jn)}}else w(Je,"Using default OfflineComponentProvider"),await Rr(n,new Nd(void 0));return n._offlineComponents}async function Vo(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(w(Je,"Using user provided OnlineComponentProvider"),await Ri(n,n._uninitializedComponentsProvider._online)):(w(Je,"Using default OnlineComponentProvider"),await Ri(n,new Gr))),n._onlineComponents}function Ld(n){return Vo(n).then((e=>e.syncEngine))}async function vo(n){const e=await Vo(n),t=e.eventManager;return t.onListen=Td.bind(null,e.syncEngine),t.onUnlisten=Id.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=Ed.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=Ad.bind(null,e.syncEngine),t}function Od(n,e,t={}){const r=new Ne;return n.asyncQueue.enqueueAndForget((async()=>(function(i,a,o,u,c){const l=new ho({next:m=>{l.Va(),a.enqueueAndForget((()=>fo(i,h)));const g=m.docs.has(o);!g&&m.fromCache?c.reject(new E(_.UNAVAILABLE,"Failed to get document because the client is offline.")):g&&m.fromCache&&u&&u.source==="server"?c.reject(new E(_.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):c.resolve(m)},error:m=>c.reject(m)}),h=new _o(Xr(o.path),l,{includeMetadataChanges:!0,waitForSyncWhenOnline:!0});return mo(i,h)})(await vo(n),n.asyncQueue,e,t,r))),r.promise}function Md(n,e,t={}){const r=new Ne;return n.asyncQueue.enqueueAndForget((async()=>(function(i,a,o,u,c){const l=new ho({next:m=>{l.Va(),a.enqueueAndForget((()=>fo(i,h))),m.fromCache&&u.source==="server"?c.reject(new E(_.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):c.resolve(m)},error:m=>c.reject(m)}),h=new _o(o instanceof Kt?gh(o):o,l,{includeMetadataChanges:!0,waitForSyncWhenOnline:!0});return mo(i,h)})(await vo(n),n.asyncQueue,e,t,r))),r.promise}function Ud(n,e){const t=new Ne;return n.asyncQueue.enqueueAndForget((async()=>Vd(await Ld(n),e,t))),t.promise}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ro=class{constructor(e,t,r,s,i){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new F(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new Fd(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){var e;return((e=this._document)==null?void 0:e.data.clone().value.mapValue.fields)??void 0}get(e){if(this._document){const t=this._document.data.field(je("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}},Fd=class extends Ro{data(){return super.data()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qd{convertValue(e,t="none"){switch(Q(e)){case 0:return null;case 1:return e.booleanValue;case 2:return M(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes($e(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw V(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const r={};return Xe(e,((s,i)=>{r[s]=this.convertValue(i,t)})),r}convertVectorValue(e){var r,s,i;const t=(i=(s=(r=e.fields)==null?void 0:r[Xt].arrayValue)==null?void 0:s.values)==null?void 0:i.map((a=>M(a.doubleValue)));return new ie(t)}convertGeoPoint(e){return new ve(M(e.latitude),M(e.longitude))}convertArray(e,t){return(e.values||[]).map((r=>this.convertValue(r,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const r=fn(e);return r==null?null:this.convertValue(r,t);case"estimate":return this.convertTimestamp(wt(e));default:return null}}convertTimestamp(e){const t=Be(e);return new k(t.seconds,t.nanos)}convertDocumentKey(e,t){const r=D.fromString(e);I(Ea(r),9688,{name:e});const s=new Yt(r.get(1),r.get(3)),i=new A(r.popFirst(5));return s.isEqual(t)||ke(`A document reference to ${i} refers to a different database (${s.projectId}/${s.database}), which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Po(n,e,t){let r;return r=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pi="AsyncQueue";class Ci{constructor(e=Promise.resolve()){this.$c=[],this.Kc=!1,this.Qc=[],this.Wc=null,this.Gc=!1,this.zc=!1,this.jc=[],this.Ht=new va(this,"async_queue_retry"),this.Hc=()=>{const r=vr();r&&w(Pi,"Visibility state changed to "+r.visibilityState),this.Ht.$t()},this.Jc=e;const t=vr();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.Hc)}get isShuttingDown(){return this.Kc}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.Yc(),this.Zc(e)}enterRestrictedMode(e){if(!this.Kc){this.Kc=!0,this.zc=e||!1;const t=vr();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Hc)}}enqueue(e){if(this.Yc(),this.Kc)return new Promise((()=>{}));const t=new Ne;return this.Zc((()=>this.Kc&&this.zc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.$c.push(e),this.Xc())))}async Xc(){if(this.$c.length!==0){try{await this.$c[0](),this.$c.shift(),this.Ht.reset()}catch(e){if(!St(e))throw e;w(Pi,"Operation failed with retryable error: "+e)}this.$c.length>0&&this.Ht.kt((()=>this.Xc()))}}Zc(e){const t=this.Jc.then((()=>(this.Gc=!0,e().catch((r=>{throw this.Wc=r,this.Gc=!1,ke("INTERNAL UNHANDLED ERROR: ",Si(r)),r})).then((r=>(this.Gc=!1,r))))));return this.Jc=t,t}enqueueAfterDelay(e,t,r){this.Yc(),this.jc.indexOf(e)>-1&&(t=0);const s=Ps.createAndSchedule(this,e,t,r,(i=>this.el(i)));return this.Qc.push(s),s}Yc(){this.Wc&&V(47125,{tl:Si(this.Wc)})}verifyOperationInProgress(){}async nl(){let e;do e=this.Jc,await e;while(e!==this.Jc)}rl(e){for(const t of this.Qc)if(t.timerId===e)return!0;return!1}il(e){return this.nl().then((()=>{this.Qc.sort(((t,r)=>t.targetTimeMs-r.targetTimeMs));for(const t of this.Qc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.nl()}))}sl(e){this.jc.push(e)}el(e){const t=this.Qc.indexOf(e);this.Qc.splice(t,1)}}function Si(n){let e=n.message||"";return n.stack&&(e=n.stack.includes(n.message)?n.stack:n.message+`
`+n.stack),e}class Lt extends sr{constructor(e,t,r,s){super(e,t,r,s),this.type="firestore",this._queue=new Ci,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Ci(e),this._firestoreClient=void 0,await e}}}function em(n,e){const t=typeof n=="object"?n:ko(),r=typeof n=="string"?n:e||kn,s=Lo(t,"firestore").getImmediate({identifier:r});if(!s._initialized){const i=Oo("firestore");i&&Mc(s,...i)}return s}function _r(n){if(n._terminated)throw new E(_.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||Bd(n),n._firestoreClient}function Bd(n){var r,s,i,a;const e=n._freezeSettings(),t=Cc(n._databaseId,((r=n._app)==null?void 0:r.options.appId)||"",n._persistenceKey,(s=n._app)==null?void 0:s.options.apiKey,e);n._componentsProvider||(i=e.localCache)!=null&&i._offlineComponentProvider&&((a=e.localCache)!=null&&a._onlineComponentProvider)&&(n._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),n._firestoreClient=new Dd(n._authCredentials,n._appCheckCredentials,n._queue,t,n._componentsProvider&&(function(u){const c=u==null?void 0:u._online.build();return{_offline:u==null?void 0:u._offline.build(c),_online:c}})(n._componentsProvider))}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Co extends qd{constructor(e){super(),this.firestore=e}convertBytes(e){return new pe(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new F(this.firestore,null,t)}}class Bt{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class at extends Ro{constructor(e,t,r,s,i,a){super(e,t,r,s,a),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Nn(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const r=this._document.data.field(je("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new E(_.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=at._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}at._jsonSchemaVersion="firestore/documentSnapshot/1.0",at._jsonSchema={type:$("string",at._jsonSchemaVersion),bundleSource:$("string","DocumentSnapshot"),bundleName:$("string"),bundle:$("string")};class Nn extends at{data(e={}){return super.data(e)}}class Tt{constructor(e,t,r,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new Bt(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((r=>{e.call(t,new Nn(this._firestore,this._userDataWriter,r.key,r,new Bt(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new E(_.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(s,i){if(s._snapshot.oldDocs.isEmpty()){let a=0;return s._snapshot.docChanges.map((o=>{j(s._snapshot.query)?Fr(s._snapshot.query):Zr(s.query._query);const u=new Nn(s._firestore,s._userDataWriter,o.doc.key,o.doc,new Bt(s._snapshot.mutatedKeys.has(o.doc.key),s._snapshot.fromCache),s.query.converter);return o.doc,{type:"added",doc:u,oldIndex:-1,newIndex:a++}}))}{let a=s._snapshot.oldDocs;return s._snapshot.docChanges.filter((o=>i||o.type!==3)).map((o=>{const u=new Nn(s._firestore,s._userDataWriter,o.doc.key,o.doc,new Bt(s._snapshot.mutatedKeys.has(o.doc.key),s._snapshot.fromCache),s.query.converter);let c=-1,l=-1;return o.type!==0&&(c=a.indexOf(o.doc.key),a=a.delete(o.doc.key)),o.type!==1&&(a=a.add(o.doc),l=a.indexOf(o.doc.key)),{type:$d(o.type),doc:u,oldIndex:c,newIndex:l}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new E(_.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=Tt._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Wr.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],r=[],s=[];return this.docs.forEach((i=>{i._document!==null&&(t.push(i._document),r.push(this._userDataWriter.convertObjectMap(i._document.data.value.mapValue.fields,"previous")),s.push(i.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function $d(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return V(61501,{type:n})}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Tt._jsonSchemaVersion="firestore/querySnapshot/1.0",Tt._jsonSchema={type:$("string",Tt._jsonSchemaVersion),bundleSource:$("string","QuerySnapshot"),bundleName:$("string"),bundle:$("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zd(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new E(_.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Ns{}class So extends Ns{}function tm(n,e,...t){let r=[];e instanceof Ns&&r.push(e),r=r.concat(t),(function(i){const a=i.filter((u=>u instanceof Ds)).length,o=i.filter((u=>u instanceof pr)).length;if(a>1||a>0&&o>0)throw new E(_.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(r);for(const s of r)n=s._apply(n);return n}class pr extends So{constructor(e,t,r){super(),this._field=e,this._op=t,this._value=r,this.type="where"}static _create(e,t,r){return new pr(e,t,r)}_apply(e){const t=this._parse(e);return xo(e._query,t),new lt(e.firestore,e.converter,Nr(e._query,t))}_parse(e){const t=is(e.firestore);return(function(i,a,o,u,c,l,h){let m;if(c.isKeyField()){if(l==="array-contains"||l==="array-contains-any")throw new E(_.INVALID_ARGUMENT,`Invalid Query. You can't perform '${l}' queries on documentId().`);if(l==="in"||l==="not-in"){bi(h,l);const y=[];for(const S of h)y.push(xi(u,i,S));m={arrayValue:{values:y}}}else m=xi(u,i,h)}else l!=="in"&&l!=="not-in"&&l!=="array-contains-any"||bi(h,l),m=zc(o,a,h,l==="in"||l==="not-in");return B.create(c,l,m)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function nm(n,e,t){const r=e,s=je("where",n);return pr._create(s,r,t)}class Ds extends Ns{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new Ds(e,t)}_parse(e){const t=this._queryConstraints.map((r=>r._parse(e))).filter((r=>r.getFilters().length>0));return t.length===1?t[0]:Te.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:((function(s,i){let a=s;const o=i.getFlattenedFilters();for(const u of o)xo(a,u),a=Nr(a,u)})(e._query,t),new lt(e.firestore,e.converter,Nr(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class ks extends So{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new ks(e,t)}_apply(e){const t=(function(s,i,a){if(s.startAt!==null)throw new E(_.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(s.endAt!==null)throw new E(_.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new rn(i,a)})(e._query,this._field,this._direction);return new lt(e.firestore,e.converter,ku(e._query,t))}}function rm(n,e="asc"){const t=e,r=je("orderBy",n);return ks._create(r,t)}function xi(n,e,t){if(typeof(t=Re(t))=="string"){if(t==="")throw new E(_.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!oa(e)&&t.indexOf("/")!==-1)throw new E(_.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const r=e.path.child(D.fromString(t));if(!A.isDocumentKey(r))throw new E(_.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return js(n,new A(r))}if(t instanceof F)return js(n,t._key);throw new E(_.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Wn(t)}.`)}function bi(n,e){if(!Array.isArray(n)||n.length===0)throw new E(_.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function xo(n,e){const t=(function(s,i){for(const a of s)for(const o of a.getFlattenedFilters())if(i.indexOf(o.op)>=0)return o.op;return null})(n.filters,(function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new E(_.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new E(_.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gd{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=is(e)}set(e,t,r){this._verifyNotCommitted();const s=Pr(e,this._firestore),i=Po(s.converter,t,r),a=ba(this._dataReader,"WriteBatch.set",s._key,i,s.converter!==null,r);return this._mutations.push(a.toMutation(s._key,fe.none())),this}update(e,t,r,...s){this._verifyNotCommitted();const i=Pr(e,this._firestore);let a;return a=typeof(t=Re(t))=="string"||t instanceof nr?$c(this._dataReader,"WriteBatch.update",i._key,t,r,s):Bc(this._dataReader,"WriteBatch.update",i._key,t),this._mutations.push(a.toMutation(i._key,fe.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=Pr(e,this._firestore);return this._mutations=this._mutations.concat(new Zn(t._key,fe.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new E(_.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function Pr(n,e){if((n=Re(n)).firestore!==e)throw new E(_.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sm(n){n=Le(n,F);const e=Le(n.firestore,Lt),t=_r(e);return Od(t,n._key).then((r=>Qd(e,n,r)))}function im(n){n=Le(n,lt);const e=Le(n.firestore,Lt),t=_r(e),r=new Co(e);return zd(n._query),Md(t,n._query).then((s=>new Tt(e,r,n,s)))}function am(n,e,t){n=Le(n,F);const r=Le(n.firestore,Lt),s=Po(n.converter,e,t),i=is(r);return Ls(r,[ba(i,"setDoc",n._key,s,n.converter!==null,t).toMutation(n._key,fe.none())])}function om(n){return Ls(Le(n.firestore,Lt),[new Zn(n._key,fe.none())])}function Ls(n,e){const t=_r(n);return Ud(t,e)}function Qd(n,e,t){const r=t.docs.get(e._key),s=new Co(n);return new at(n,s,e._key,r,new Bt(t.hasPendingWrites,t.fromCache),e.converter)}function um(n){return n=Le(n,Lt),_r(n),new Gd(n,(e=>Ls(n,e)))}const Ni="@firebase/firestore",Di="4.17.2";(function(e,t=!0){Jo(Yo),Ko(new Ho("firestore",((r,{instanceIdentifier:s,options:i})=>{const a=r.getProvider("app").getImmediate(),o=new Lt(new mc(r.getProvider("auth-internal")),new pc(a,r.getProvider("app-check-internal")),au(a,s),a);return i={useFetchStreams:t,...i},o._setSettings(i),o}),"PUBLIC").setMultipleInstances(!0)),Us(Ni,Di,e),Us(Ni,Di,"esm2020")})();export{im as a,um as b,Yd as c,Jd as d,om as e,sm as f,em as g,rm as o,tm as q,am as s,nm as w};
