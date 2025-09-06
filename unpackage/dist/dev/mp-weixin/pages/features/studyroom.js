(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/features/studyroom"],{

/***/ 203:
/*!**********************************************************************************************************!*\
  !*** D:/netease-codewave-competition/campus-life-system/main.js?{"page":"pages%2Ffeatures%2Fstudyroom"} ***!
  \**********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, createPage) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
__webpack_require__(/*! uni-pages */ 26);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
var _studyroom = _interopRequireDefault(__webpack_require__(/*! ./pages/features/studyroom.vue */ 204));
// @ts-ignore
wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;
createPage(_studyroom.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["createPage"]))

/***/ }),

/***/ 204:
/*!***************************************************************************************!*\
  !*** D:/netease-codewave-competition/campus-life-system/pages/features/studyroom.vue ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _studyroom_vue_vue_type_template_id_ee71dbea_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./studyroom.vue?vue&type=template&id=ee71dbea&scoped=true& */ 205);
/* harmony import */ var _studyroom_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./studyroom.vue?vue&type=script&lang=js& */ 207);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _studyroom_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _studyroom_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _studyroom_vue_vue_type_style_index_0_id_ee71dbea_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./studyroom.vue?vue&type=style&index=0&id=ee71dbea&scoped=true&lang=css& */ 209);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 93);

var renderjs





/* normalize component */

var component = Object(_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _studyroom_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _studyroom_vue_vue_type_template_id_ee71dbea_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _studyroom_vue_vue_type_template_id_ee71dbea_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "ee71dbea",
  null,
  false,
  _studyroom_vue_vue_type_template_id_ee71dbea_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "pages/features/studyroom.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 205:
/*!**********************************************************************************************************************************!*\
  !*** D:/netease-codewave-competition/campus-life-system/pages/features/studyroom.vue?vue&type=template&id=ee71dbea&scoped=true& ***!
  \**********************************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_node_modules_unplugin_vue2_script_setup_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue2_script_setup_studyroom_vue_vue_type_template_id_ee71dbea_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!../../node_modules/unplugin-vue2-script-setup/node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue2-script-setup!./studyroom.vue?vue&type=template&id=ee71dbea&scoped=true& */ 206);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_node_modules_unplugin_vue2_script_setup_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue2_script_setup_studyroom_vue_vue_type_template_id_ee71dbea_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_node_modules_unplugin_vue2_script_setup_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue2_script_setup_studyroom_vue_vue_type_template_id_ee71dbea_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_node_modules_unplugin_vue2_script_setup_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue2_script_setup_studyroom_vue_vue_type_template_id_ee71dbea_scoped_true___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_node_modules_unplugin_vue2_script_setup_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue2_script_setup_studyroom_vue_vue_type_template_id_ee71dbea_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 206:
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/netease-codewave-competition/campus-life-system/node_modules/unplugin-vue2-script-setup/node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue2-script-setup!D:/netease-codewave-competition/campus-life-system/pages/features/studyroom.vue?vue&type=template&id=ee71dbea&scoped=true& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return recyclableRender; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "components", function() { return components; });
var components
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  var g0 = _vm.timeFilterOptions.map(function (t) {
    return t.label
  })
  var l0 = _vm.__map(_vm.filteredRooms, function (room, __i0__) {
    var $orig = _vm.__get_orig(room)
    var m0 = _vm.crowdText(room.level)
    var m1 = _vm.crowdColor(room.level)
    return {
      $orig: $orig,
      m0: m0,
      m1: m1,
    }
  })
  _vm.$mp.data = Object.assign(
    {},
    {
      $root: {
        g0: g0,
        l0: l0,
      },
    }
  )
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 207:
/*!****************************************************************************************************************!*\
  !*** D:/netease-codewave-competition/campus-life-system/pages/features/studyroom.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_node_modules_unplugin_vue2_script_setup_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue2_script_setup_studyroom_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!../../node_modules/unplugin-vue2-script-setup/node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue2-script-setup!./studyroom.vue?vue&type=script&lang=js& */ 208);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_node_modules_unplugin_vue2_script_setup_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue2_script_setup_studyroom_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_node_modules_unplugin_vue2_script_setup_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue2_script_setup_studyroom_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_node_modules_unplugin_vue2_script_setup_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue2_script_setup_studyroom_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_node_modules_unplugin_vue2_script_setup_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue2_script_setup_studyroom_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_node_modules_unplugin_vue2_script_setup_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue2_script_setup_studyroom_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 208:
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/netease-codewave-competition/campus-life-system/node_modules/unplugin-vue2-script-setup/node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue2-script-setup!D:/netease-codewave-competition/campus-life-system/pages/features/studyroom.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ 30));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ 32));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ 18));
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  data: function data() {
    return {
      isExamPeriod: true,
      // 是否为考试周
      filterOptions: ['全部自习室', '图书馆', '教学楼', '空位优先'],
      filterIndex: 0,
      timeFilterOptions: [{
        label: '实时',
        type: 'now'
      }, {
        label: '早上',
        type: 'slot',
        start: '08:00',
        end: '12:00'
      }, {
        label: '下午',
        type: 'slot',
        start: '12:00',
        end: '18:00'
      }, {
        label: '晚上',
        type: 'slot',
        start: '18:00',
        end: '22:00'
      }],
      selectedTimeFilterIndex: 0,
      baseRooms: [],
      // 从API获取的原始自习室列表
      rooms: [],
      // 经过处理后用于展示的列表
      allDailyBookings: [],
      // 存储所有自习室当天的所有预定记录
      showSeatSelector: false,
      selectedRoom: null,
      // 将 'null' 作为初始值
      seats: [],
      allSeatsInSelectedRoom: [],
      // 新增：用于存储从API获取的原始座位列表
      dailyBookings: [],
      // 存储一个自习室当天的所有预定记录
      selectedSeat: null,
      // 将 'null' 作为初始值
      timeRange: [['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'], ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00']],
      timeIndex: [0, 1],
      // 默认8:00-09:00
      showVoucher: false,
      voucher: {},
      showRealtimePanel: false,
      lastUpdateTime: '',
      // 初始化为空
      currentDate: ''
    };
  },
  computed: {
    totalVacancies: function totalVacancies() {
      return this.rooms.reduce(function (sum, room) {
        return sum + room.available;
      }, 0);
    },
    totalRooms: function totalRooms() {
      return this.rooms.length;
    },
    peakHours: function peakHours() {
      if (!this.allDailyBookings) {
        return '计算中...';
      }
      if (this.allDailyBookings.length === 0) {
        return '任意时段';
      }

      // 定义时间槽，从 8:00 到 21:00，共14个一小时的槽
      var totalSlots = 14;
      var slotCounts = new Array(totalSlots).fill(0);
      var baseHour = 8;

      // 遍历所有预定记录
      this.allDailyBookings.forEach(function (booking) {
        var bookingStartSec = booking.start_time_sec;
        var bookingEndSec = booking.end_time_sec;

        // 检查这个预定与哪个时间槽重叠
        for (var i = 0; i < totalSlots; i++) {
          var slotStartSec = (baseHour + i) * 3600;
          var slotEndSec = (baseHour + i + 1) * 3600;

          // 重叠条件: (StartA < EndB) and (EndA > StartB)
          if (bookingStartSec < slotEndSec && bookingEndSec > slotStartSec) {
            slotCounts[i]++;
          }
        }
      });
      var maxBookings = Math.max.apply(Math, (0, _toConsumableArray2.default)(slotCounts));
      if (maxBookings === 0) {
        return '任意时段';
      }

      // 找出所有高峰时段的索引
      var peakIndices = [];
      slotCounts.forEach(function (count, index) {
        if (count === maxBookings) {
          peakIndices.push(index);
        }
      });

      // 寻找最长的连续高峰时段 (如果长度相同，则取当天最晚的那个)
      var longestStreak = 0;
      var currentStreak = 0;
      var longestStreakEndIndex = -1;
      for (var i = 0; i < peakIndices.length; i++) {
        if (i > 0 && peakIndices[i] === peakIndices[i - 1] + 1) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
        if (currentStreak >= longestStreak) {
          longestStreak = currentStreak;
          longestStreakEndIndex = peakIndices[i];
        }
      }
      var startStreakIndex = longestStreakEndIndex - longestStreak + 1;
      var startHour = baseHour + startStreakIndex;
      var endHour = baseHour + longestStreakEndIndex + 1;
      var formatHour = function formatHour(h) {
        return "".concat(String(h).padStart(2, '0'), ":00");
      };
      return "".concat(formatHour(startHour), "-").concat(formatHour(endHour));
    },
    filteredRooms: function filteredRooms() {
      var roomsToSort = (0, _toConsumableArray2.default)(this.rooms);
      var filter = this.filterOptions[this.filterIndex];
      var libraryRooms = ['中央图书馆', '文科楼自习室'];
      var teachingBuildingRooms = ['理科楼自习室', '综合楼自习室', '图书馆西区'];
      if (filter === '图书馆') {
        return roomsToSort.filter(function (room) {
          return room.name && libraryRooms.includes(room.name);
        });
      }
      if (filter === '教学楼') {
        return roomsToSort.filter(function (room) {
          return room.name && teachingBuildingRooms.includes(room.name);
        });
      }
      if (filter === '空位优先') {
        return roomsToSort.sort(function (a, b) {
          return b.available - a.available;
        });
      }
      return roomsToSort; // '全部自习室'
    }
  },
  onLoad: function onLoad() {
    // 检查登录状态
    var token = uni.getStorageSync('token');
    if (!token) {
      uni.showToast({
        title: '请先登录',
        icon: 'none'
      });
      setTimeout(function () {
        uni.navigateTo({
          url: '/pages/login/index'
        });
      }, 1500);
      return;
    }

    // 初始化日期和时间
    var now = new Date();
    this.currentDate = this.formatDate(now);
    this.lastUpdateTime = now.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });

    // 加载自习室数据，初次加载显示loading
    this.fetchAndProcessRooms(true);
  },
  methods: {
    crowdText: function crowdText(level) {
      var map = {
        'low': '空闲',
        'medium': '适中',
        'high': '拥挤',
        'full': '无座'
      };
      return map[level] || '未知';
    },
    crowdColor: function crowdColor(level) {
      var map = {
        'low': '#67c23a',
        // 绿色
        'medium': '#e6a23c',
        // 黄色
        'high': '#f56c6c',
        // 红色
        'full': '#909399' // 灰色
      };

      return map[level] || '#909399';
    },
    onTimeFilterChange: function onTimeFilterChange(e) {
      this.selectedTimeFilterIndex = e.detail.value;
      this.processRoomsWithBookings(); // 当时间筛选变化时，重新计算
    },
    timeToSeconds: function timeToSeconds(timeStr) {
      if (!timeStr) return 0;
      var parts = timeStr.split(':');
      if (parts.length < 2) return 0; // 避免 split 失败
      return parseInt(parts[0], 10) * 3600 + parseInt(parts[1], 10) * 60;
    },
    formatDate: function formatDate(date) {
      var year = date.getFullYear();
      var month = String(date.getMonth() + 1).padStart(2, '0');
      var day = String(date.getDate()).padStart(2, '0');
      return "".concat(year, "-").concat(month, "-").concat(day);
    },
    processRoomsWithBookings: function processRoomsWithBookings() {
      var filterOption = this.timeFilterOptions[this.selectedTimeFilterIndex];
      var targetStartSec;
      var targetEndSec;
      if (filterOption.type === 'now') {
        var now = new Date();
        targetStartSec = this.timeToSeconds(now.toLocaleTimeString('sv-SE', {
          hour: '2-digit',
          minute: '2-digit'
        }));
        targetEndSec = targetStartSec + 1; // Check for this instant
      } else if (filterOption.type === 'slot') {
        targetStartSec = this.timeToSeconds(filterOption.start);
        targetEndSec = this.timeToSeconds(filterOption.end);
      }
      if (targetStartSec === undefined) return;
      var bookingsByRoomId = {};
      this.allDailyBookings.forEach(function (booking) {
        var roomId = booking.room_id;
        if (!bookingsByRoomId[roomId]) {
          bookingsByRoomId[roomId] = [];
        }
        bookingsByRoomId[roomId].push(booking);
      });
      this.rooms = this.baseRooms.map(function (room) {
        var roomBookings = bookingsByRoomId[room.id] || [];
        var occupiedSeats = new Set();
        roomBookings.forEach(function (booking) {
          // Check for time overlap: (StartA < EndB) and (EndA > StartB)
          if (booking.start_time_sec < targetEndSec && booking.end_time_sec > targetStartSec) {
            occupiedSeats.add(booking.seat_id);
          }
        });
        var availableCount = room.total_seats - occupiedSeats.size;
        var occupancy = room.total_seats > 0 ? occupiedSeats.size / room.total_seats : 1;
        var level = 'full';
        if (occupancy < 1) level = 'high';
        if (occupancy <= 0.7) level = 'medium';
        if (occupancy <= 0.4) level = 'low';
        return _objectSpread(_objectSpread({}, room), {}, {
          id: room.id,
          name: room.name,
          location: room.location,
          total: room.total_seats,
          available: availableCount,
          level: availableCount === 0 ? 'full' : level
        });
      });
      this.lastUpdateTime = new Date().toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    fetchAndProcessRooms: function fetchAndProcessRooms() {
      var _arguments = arguments,
        _this = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var showLoading, token, roomRes, bookingRes;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                showLoading = _arguments.length > 0 && _arguments[0] !== undefined ? _arguments[0] : true;
                if (showLoading) {
                  uni.showLoading({
                    title: '加载实时数据...'
                  });
                }
                _context.prev = 2;
                // 1. 获取自习室基础列表
                token = uni.getStorageSync('token');
                _context.next = 6;
                return uni.request({
                  url: 'http://localhost:3000/api/studyroom/list',
                  method: 'GET',
                  header: {
                    'Authorization': "Bearer ".concat(token)
                  }
                });
              case 6:
                roomRes = _context.sent;
                if (!(roomRes.statusCode !== 200 || !roomRes.data.success)) {
                  _context.next = 9;
                  break;
                }
                throw new Error('获取自习室列表失败');
              case 9:
                _this.baseRooms = roomRes.data.data;

                // 2. 获取当天所有预约记录
                _context.next = 12;
                return uni.request({
                  url: "http://localhost:3000/api/studyroom/bookings/date/".concat(_this.currentDate),
                  method: 'GET',
                  header: {
                    'Authorization': "Bearer ".concat(token)
                  }
                });
              case 12:
                bookingRes = _context.sent;
                if (bookingRes.statusCode === 200 && bookingRes.data.success) {
                  _this.allDailyBookings = bookingRes.data.data || [];
                } else {
                  _this.allDailyBookings = [];
                }

                // 3. 根据默认筛选器（"当前"）更新一次视图
                _this.processRoomsWithBookings();
                _context.next = 21;
                break;
              case 17:
                _context.prev = 17;
                _context.t0 = _context["catch"](2);
                console.error("获取自习室数据失败:", _context.t0);
                uni.showToast({
                  title: '数据加载失败',
                  icon: 'none'
                });
              case 21:
                _context.prev = 21;
                if (showLoading) {
                  uni.hideLoading();
                }
                return _context.finish(21);
              case 24:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[2, 17, 21, 24]]);
      }))();
    },
    updateRoomAvailability: function updateRoomAvailability() {
      // 此方法已废弃，逻辑合并到 processRoomsWithBookings
    },
    updateSeatStatuses: function updateSeatStatuses() {
      var _this2 = this;
      if (!this.selectedRoom) return;

      // 1. 获取选定的时间范围（秒）
      var startTimeStr = this.timeRange[0][this.timeIndex[0]];
      var endTimeStr = this.timeRange[1][this.timeIndex[1]];
      var selectedStartSec = this.timeToSeconds(startTimeStr);
      var selectedEndSec = this.timeToSeconds(endTimeStr);

      // 2. 为每个座位创建一个预订时间的查找表，以提高效率
      var bookingsBySeat = {};
      this.dailyBookings.forEach(function (booking) {
        if (!bookingsBySeat[booking.seat_id]) {
          bookingsBySeat[booking.seat_id] = [];
        }
        bookingsBySeat[booking.seat_id].push({
          start: booking.start_time_sec,
          end: booking.end_time_sec
        });
      });

      // 3. 映射所有座位，计算其状态和属性
      var allSeatsWithStatus = this.allSeatsInSelectedRoom.map(function (seat) {
        var isOccupied = false;
        var seatBookings = bookingsBySeat[seat.id];
        if (seatBookings) {
          var _iterator = _createForOfIteratorHelper(seatBookings),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var booking = _step.value;
              // 检查时间重叠: (StartA < EndB) and (EndA > StartB)
              if (booking.start < selectedEndSec && booking.end > selectedStartSec) {
                isOccupied = true;
                break;
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }
        var status = isOccupied ? 'occupied' : 'available';
        // 如果是当前选中的座位且未被占用，则保持'selected'状态
        if (_this2.selectedSeat && _this2.selectedSeat.id === seat.id && !isOccupied) {
          status = 'selected';
        }
        return {
          id: seat.id,
          label: seat.label,
          displayLabel: "".concat(seat.row_no, "-").concat(seat.col_no),
          // 简化的显示标签
          status: status,
          row: seat.row_no
        };
      });

      // 4. 检查当前选中的座位是否在新的时间段内变得不可用
      if (this.selectedSeat) {
        var currentSelectedSeatInfo = allSeatsWithStatus.find(function (s) {
          return s.id === _this2.selectedSeat.id;
        });
        if (currentSelectedSeatInfo && currentSelectedSeatInfo.status === 'occupied') {
          uni.showToast({
            title: '您选择的座位在该时段已被预约，请重新选择',
            icon: 'none'
          });
          this.selectedSeat = null; // 取消选择
          // 再次遍历以更新该座位的状态为'occupied'
          allSeatsWithStatus.forEach(function (s) {
            if (s.id === currentSelectedSeatInfo.id) {
              s.status = 'occupied';
            }
          });
        }
      }

      // 5. 按行号对所有座位进行分组
      var grouped = allSeatsWithStatus.reduce(function (acc, seat) {
        if (seat.row === -1) return acc; // 忽略无效的行号
        if (!acc[seat.row]) {
          acc[seat.row] = [];
        }
        acc[seat.row].push(seat);
        return acc;
      }, {});

      // 6. 将分组后的对象转换为模板所需的二维数组
      this.seats = Object.values(grouped);
    },
    fetchStudyRooms: function fetchStudyRooms() {
      // 此方法已废弃，逻辑合并到 fetchAndProcessRooms
    },
    bookRoom: function bookRoom(room) {
      var _this3 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        var token, seatRes, sortedSeats, bookingRes;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(room.available <= 0)) {
                  _context2.next = 2;
                  break;
                }
                return _context2.abrupt("return");
              case 2:
                _this3.selectedRoom = room;
                uni.showLoading({
                  title: '加载座位...'
                });
                _context2.prev = 4;
                // 1. 获取该自习室的所有座位
                token = uni.getStorageSync('token');
                _context2.next = 8;
                return uni.request({
                  url: "http://localhost:3000/api/studyroom/".concat(room.id, "/seats"),
                  method: 'GET',
                  header: {
                    'Authorization': "Bearer ".concat(token)
                  }
                });
              case 8:
                seatRes = _context2.sent;
                if (!(seatRes.statusCode !== 200 || !seatRes.data.success)) {
                  _context2.next = 11;
                  break;
                }
                throw new Error("获取座位列表失败");
              case 11:
                // 2. 对座位进行排序（按行、列）
                sortedSeats = seatRes.data.data.sort(function (a, b) {
                  if (a.row_no !== b.row_no) {
                    return a.row_no - b.row_no;
                  }
                  return a.col_no - b.col_no;
                });
                _this3.allSeatsInSelectedRoom = sortedSeats;

                // 3. 获取当天的预定记录
                _context2.next = 15;
                return uni.request({
                  url: "http://localhost:3000/api/studyroom/".concat(room.id, "/bookings/date/").concat(_this3.currentDate),
                  method: 'GET',
                  header: {
                    'Authorization': "Bearer ".concat(token)
                  }
                });
              case 15:
                bookingRes = _context2.sent;
                if (bookingRes.statusCode === 200 && bookingRes.data.success) {
                  // 直接使用返回的预约记录，因为API已经过滤了房间
                  _this3.dailyBookings = bookingRes.data.data || [];
                } else {
                  _this3.dailyBookings = [];
                }

                // 4. 根据默认时间更新座位状态
                _this3.updateSeatStatuses();
                _this3.showSeatSelector = true;
                _context2.next = 25;
                break;
              case 21:
                _context2.prev = 21;
                _context2.t0 = _context2["catch"](4);
                console.error("加载座位信息失败:", _context2.t0);
                uni.showToast({
                  title: '加载座位失败',
                  icon: 'none'
                });
              case 25:
                _context2.prev = 25;
                uni.hideLoading();
                return _context2.finish(25);
              case 28:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[4, 21, 25, 28]]);
      }))();
    },
    // 关闭座位选择器
    closeSeatSelector: function closeSeatSelector() {
      this.showSeatSelector = false;
      this.selectedRoom = null;
      this.seats = [];
      this.dailyBookings = [];
      this.selectedSeat = null;
      this.allSeatsInSelectedRoom = [];
    },
    // 选择座位
    selectSeat: function selectSeat(seat) {
      var _this4 = this;
      if (seat.status === 'occupied') {
        uni.showToast({
          title: '该座位已被预约',
          icon: 'none'
        });
        return;
      }
      var isCurrentlySelected = seat.status === 'selected';

      // 如果有其他座位被选中，则先取消那个座位的选中状态
      if (this.selectedSeat && this.selectedSeat.id !== seat.id) {
        var flatSeats = this.seats.flat();
        var prevSeat = flatSeats.find(function (s) {
          return s.id === _this4.selectedSeat.id;
        });
        if (prevSeat) {
          prevSeat.status = 'available';
        }
      }

      // 切换当前点击座位的状态
      if (isCurrentlySelected) {
        seat.status = 'available';
        this.selectedSeat = null;
      } else {
        seat.status = 'selected';
        this.selectedSeat = seat;
      }
    },
    // 时间选择变化
    timeChange: function timeChange(e) {
      this.timeIndex = e.detail.value;
      // 重新计算并更新座位状态
      this.updateSeatStatuses();
    },
    // 确认预约
    confirmBooking: function confirmBooking() {
      var _this5 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        var roomName, seatLabel, seatId, startTime, endTime, bookingData, token, res, errorMessage;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!(!_this5.selectedSeat || !_this5.selectedRoom)) {
                  _context3.next = 3;
                  break;
                }
                uni.showToast({
                  title: '数据错误，请重试',
                  icon: 'none'
                });
                return _context3.abrupt("return");
              case 3:
                uni.showLoading({
                  title: '正在提交预约...'
                });

                // 提前将需要的变量存储起来，防止后续被清空
                roomName = _this5.selectedRoom.name;
                seatLabel = _this5.selectedSeat.displayLabel || _this5.selectedSeat.label; // 优先使用简化的显示标签
                seatId = _this5.selectedSeat.id;
                startTime = _this5.timeRange[0][_this5.timeIndex[0]];
                endTime = _this5.timeRange[1][_this5.timeIndex[1]];
                _context3.prev = 9;
                bookingData = {
                  roomId: _this5.selectedRoom.id,
                  seatId: seatId,
                  date: _this5.currentDate,
                  startTimeSec: _this5.timeToSeconds(startTime),
                  endTimeSec: _this5.timeToSeconds(endTime)
                };
                token = uni.getStorageSync('token');
                _context3.next = 14;
                return uni.request({
                  url: 'http://localhost:3000/api/studyroom/book',
                  method: 'POST',
                  data: bookingData,
                  header: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer ".concat(token)
                  }
                });
              case 14:
                res = _context3.sent;
                if (!(res.statusCode === 200 && res.data.success)) {
                  _context3.next = 24;
                  break;
                }
                uni.hideLoading();
                uni.showToast({
                  title: '预约成功！',
                  icon: 'success'
                });
                _this5.closeSeatSelector();
                _this5.voucher = {
                  room: roomName,
                  seat: seatLabel,
                  date: _this5.currentDate,
                  time: "".concat(startTime, " - ").concat(endTime),
                  expire: endTime
                };
                _this5.showVoucher = true;

                // 重新加载所有房间的预订，静默刷新，不显示loading
                _this5.fetchAndProcessRooms(false);
                _context3.next = 26;
                break;
              case 24:
                // 处理HTTP错误或业务逻辑错误
                errorMessage = res.data && res.data.message ? res.data.message : '预约失败，请稍后再试';
                throw new Error(errorMessage);
              case 26:
                _context3.next = 33;
                break;
              case 28:
                _context3.prev = 28;
                _context3.t0 = _context3["catch"](9);
                uni.hideLoading();
                console.error("确认预约失败:", _context3.t0);
                uni.showToast({
                  title: _context3.t0.message || '提交预约时发生错误',
                  icon: 'none',
                  duration: 3000
                });
              case 33:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[9, 28]]);
      }))();
    },
    // 关闭凭证
    closeVoucher: function closeVoucher() {
      this.showVoucher = false;
    },
    // 添加到期提醒
    addReminder: function addReminder() {
      uni.showToast({
        title: '已设置到期前10分钟提醒',
        icon: 'success'
      });
    },
    // 保存凭证
    saveVoucher: function saveVoucher() {
      uni.showToast({
        title: '凭证已保存到"我的预约"',
        icon: 'success'
      });
    },
    // 显示实时空位
    showRealtime: function showRealtime() {
      this.showRealtimePanel = true;
    },
    // 关闭实时空位
    closeRealtime: function closeRealtime() {
      this.showRealtimePanel = false;
    },
    // 刷新实时数据
    refreshRealtime: function refreshRealtime() {
      var _this6 = this;
      uni.showLoading({
        title: '刷新数据中...'
      });

      // 模拟刷新
      setTimeout(function () {
        // 随机更新空位数
        _this6.rooms.forEach(function (room) {
          if (room.available > 0) {
            var change = Math.floor(Math.random() * 5) - 2; // -2到2的随机变化
            room.available = Math.max(0, Math.min(room.total, room.available + change));

            // 更新拥挤程度
            var ratio = room.available / room.total;
            if (ratio > 0.3) room.level = 'low';else if (ratio > 0.1) room.level = 'medium';else room.level = 'high';
          }
        });

        // 更新时间
        _this6.lastUpdateTime = new Date().toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit'
        });
        uni.hideLoading();
        uni.showToast({
          title: '数据已更新',
          icon: 'success'
        });
      }, 1000);
    },
    filterChange: function filterChange(e) {
      this.filterIndex = e.detail.value;
    },
    goToMyReservations: function goToMyReservations() {
      uni.navigateTo({
        url: '/pages/features/my-studyroom-reservations'
      });
    }
  },
  onReady: function onReady() {
    // 页面加载完成
  }
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ }),

/***/ 209:
/*!************************************************************************************************************************************************!*\
  !*** D:/netease-codewave-competition/campus-life-system/pages/features/studyroom.vue?vue&type=style&index=0&id=ee71dbea&scoped=true&lang=css& ***!
  \************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_node_modules_unplugin_vue2_script_setup_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue2_script_setup_studyroom_vue_vue_type_style_index_0_id_ee71dbea_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--6-oneOf-1-3!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!../../node_modules/unplugin-vue2-script-setup/node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue2-script-setup!./studyroom.vue?vue&type=style&index=0&id=ee71dbea&scoped=true&lang=css& */ 210);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_node_modules_unplugin_vue2_script_setup_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue2_script_setup_studyroom_vue_vue_type_style_index_0_id_ee71dbea_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_node_modules_unplugin_vue2_script_setup_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue2_script_setup_studyroom_vue_vue_type_style_index_0_id_ee71dbea_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_node_modules_unplugin_vue2_script_setup_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue2_script_setup_studyroom_vue_vue_type_style_index_0_id_ee71dbea_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_node_modules_unplugin_vue2_script_setup_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue2_script_setup_studyroom_vue_vue_type_style_index_0_id_ee71dbea_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_node_modules_unplugin_vue2_script_setup_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue2_script_setup_studyroom_vue_vue_type_style_index_0_id_ee71dbea_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 210:
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!./node_modules/postcss-loader/src??ref--6-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/netease-codewave-competition/campus-life-system/node_modules/unplugin-vue2-script-setup/node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue2-script-setup!D:/netease-codewave-competition/campus-life-system/pages/features/studyroom.vue?vue&type=style&index=0&id=ee71dbea&scoped=true&lang=css& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[203,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/features/studyroom.js.map