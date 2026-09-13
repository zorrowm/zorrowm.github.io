/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.144.0
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

import{a as f}from"./chunk-XHLLTOT5.js";import"./chunk-TLEYX4LR.js";import"./chunk-7XGUH7QD.js";import{a as u}from"./chunk-WAWVHCLX.js";import"./chunk-KIPMJOPQ.js";import"./chunk-XJYQWIPH.js";import"./chunk-MXJGW6B5.js";import"./chunk-6PAWPMJW.js";import"./chunk-I5ZF3XWC.js";import"./chunk-RWUM5W33.js";import"./chunk-L5KH4S7I.js";import"./chunk-FCVJPC5K.js";import"./chunk-RSRAKNZZ.js";import"./chunk-5LQY6FAO.js";import"./chunk-PW3RSZDZ.js";import"./chunk-LFZTAB7C.js";import"./chunk-FDW54Q4P.js";import"./chunk-7QBHUBLZ.js";import"./chunk-CGV6OYZ7.js";import"./chunk-HF7WOKX3.js";import"./chunk-J7NGPMOA.js";import"./chunk-7SUH2MBM.js";import"./chunk-WXHYCUXA.js";import"./chunk-2SJVMCEY.js";function h(c,d){let e=f.upsampleMesh(c),t=e.vertices.buffer,i=e.indices.buffer,s=e.westIndicesSouthToNorth.buffer,o=e.southIndicesEastToWest.buffer,r=e.eastIndicesNorthToSouth.buffer,n=e.northIndicesWestToEast.buffer;return d.push(t,i,s,o,r,n),{verticesBuffer:t,indicesBuffer:i,vertexCountWithoutSkirts:e.vertexCountWithoutSkirts,indexCountWithoutSkirts:e.indexCountWithoutSkirts,encoding:e.encoding,westIndicesBuffer:s,southIndicesBuffer:o,eastIndicesBuffer:r,northIndicesBuffer:n,minimumHeight:e.minimumHeight,maximumHeight:e.maximumHeight,boundingSphere:e.boundingSphere3D,orientedBoundingBox:e.orientedBoundingBox,horizonOcclusionPoint:e.horizonOcclusionPoint}}var I=u(h);export{I as default};
