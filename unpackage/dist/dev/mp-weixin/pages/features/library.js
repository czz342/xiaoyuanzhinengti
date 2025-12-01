(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/features/library"],{

/***/ 155:
/*!********************************************************************************************************!*\
  !*** D:/netease-codewave-competition/campus-life-system/main.js?{"page":"pages%2Ffeatures%2Flibrary"} ***!
  \********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, createPage) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
__webpack_require__(/*! uni-pages */ 26);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
var _library = _interopRequireDefault(__webpack_require__(/*! ./pages/features/library.vue */ 156));
// @ts-ignore
wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;
createPage(_library.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["createPage"]))

/***/ }),

/***/ 156:
/*!*************************************************************************************!*\
  !*** D:/netease-codewave-competition/campus-life-system/pages/features/library.vue ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _library_vue_vue_type_template_id_56c518e2___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./library.vue?vue&type=template&id=56c518e2& */ 157);
/* harmony import */ var _library_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./library.vue?vue&type=script&lang=js& */ 159);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _library_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _library_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _library_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./library.vue?vue&type=style&index=0&lang=css& */ 161);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 93);

var renderjs





/* normalize component */

var component = Object(_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _library_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _library_vue_vue_type_template_id_56c518e2___WEBPACK_IMPORTED_MODULE_0__["render"],
  _library_vue_vue_type_template_id_56c518e2___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null,
  false,
  _library_vue_vue_type_template_id_56c518e2___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "pages/features/library.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 157:
/*!********************************************************************************************************************!*\
  !*** D:/netease-codewave-competition/campus-life-system/pages/features/library.vue?vue&type=template&id=56c518e2& ***!
  \********************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_node_modules_unplugin_vue2_script_setup_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue2_script_setup_library_vue_vue_type_template_id_56c518e2___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!../../node_modules/unplugin-vue2-script-setup/node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue2-script-setup!./library.vue?vue&type=template&id=56c518e2& */ 158);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_node_modules_unplugin_vue2_script_setup_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue2_script_setup_library_vue_vue_type_template_id_56c518e2___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_node_modules_unplugin_vue2_script_setup_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue2_script_setup_library_vue_vue_type_template_id_56c518e2___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_node_modules_unplugin_vue2_script_setup_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue2_script_setup_library_vue_vue_type_template_id_56c518e2___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_node_modules_unplugin_vue2_script_setup_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue2_script_setup_library_vue_vue_type_template_id_56c518e2___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 158:
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/netease-codewave-competition/campus-life-system/node_modules/unplugin-vue2-script-setup/node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue2-script-setup!D:/netease-codewave-competition/campus-life-system/pages/features/library.vue?vue&type=template&id=56c518e2& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return recyclableRender; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "components", function() { return components; });
var components
try {
  components = {
    uniNumberBox: function () {
      return __webpack_require__.e(/*! import() | uni_modules/uni-number-box/components/uni-number-box/uni-number-box */ "uni_modules/uni-number-box/components/uni-number-box/uni-number-box").then(__webpack_require__.bind(null, /*! @/uni_modules/uni-number-box/components/uni-number-box/uni-number-box.vue */ 683))
    },
  }
} catch (e) {
  if (
    e.message.indexOf("Cannot find module") !== -1 &&
    e.message.indexOf(".vue") !== -1
  ) {
    console.error(e.message)
    console.error("1. 排查组件名称拼写是否正确")
    console.error(
      "2. 排查组件是否符合 easycom 规范，文档：https://uniapp.dcloud.net.cn/collocation/pages?id=easycom"
    )
    console.error(
      "3. 若组件不符合 easycom 规范，需手动引入，并在 components 中注册该组件"
    )
  } else {
    throw e
  }
}
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  var g0 = _vm.categories.length
  var g1 =
    _vm.currentTab === "search" && !_vm.isSearchMode
      ? _vm.recommendedBooks.length
      : null
  var g2 =
    _vm.currentTab === "shelf" || _vm.currentTab === "history"
      ? !_vm.myBorrowings.length && !_vm.isLoading
      : null
  if (!_vm._isMounted) {
    _vm.e0 = function ($event, book) {
      var _temp = arguments[arguments.length - 1].currentTarget.dataset,
        _temp2 = _temp.eventParams || _temp["event-params"],
        book = _temp2.book
      var _temp, _temp2
      $event.stopPropagation()
      book.available ? _vm.borrowQuick(book) : _vm.reserveQuick(book)
    }
  }
  _vm.$mp.data = Object.assign(
    {},
    {
      $root: {
        g0: g0,
        g1: g1,
        g2: g2,
      },
    }
  )
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 159:
/*!**************************************************************************************************************!*\
  !*** D:/netease-codewave-competition/campus-life-system/pages/features/library.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_node_modules_unplugin_vue2_script_setup_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue2_script_setup_library_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!../../node_modules/unplugin-vue2-script-setup/node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue2-script-setup!./library.vue?vue&type=script&lang=js& */ 160);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_node_modules_unplugin_vue2_script_setup_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue2_script_setup_library_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_node_modules_unplugin_vue2_script_setup_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue2_script_setup_library_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_node_modules_unplugin_vue2_script_setup_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue2_script_setup_library_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_node_modules_unplugin_vue2_script_setup_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue2_script_setup_library_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_node_modules_unplugin_vue2_script_setup_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue2_script_setup_library_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 160:
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/netease-codewave-competition/campus-life-system/node_modules/unplugin-vue2-script-setup/node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue2-script-setup!D:/netease-codewave-competition/campus-life-system/pages/features/library.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ 18));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ 32));
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
      // 搜索相关
      searchKeyword: '',
      isSearchMode: false,
      // 标签页
      currentTab: 'search',
      // 图书详情
      showBookDetail: false,
      selectedBook: {},
      borrowingDays: 30,
      // 新增：借阅天数

      // AR导航
      showARNavigation: false,
      // 图书列表数据
      recommendedBooks: [],
      searchResults: [],
      // 我的借阅数据
      myBorrowings: [],
      isLoading: false,
      // 用于防止重复加载
      showBorrowDetail: false,
      // 控制借阅详情弹窗
      selectedBorrowing: {},
      // 选中的借阅记录

      // 分类筛选器相关数据
      categories: [],
      selectedCategory: null,
      // 归还弹窗
      showReturnConfirm: false,
      returnTargetLocation: '',
      returnTargetBorrowingId: null
    };
  },
  onLoad: function onLoad(options) {
    if (options && options.billno) {
      // 来自借阅成功后的跳转链接，需要打开指定借阅记录的详情
      this.handleBorrowingDeepLink(options.billno);
    } else {
      // 正常加载
      this.fetchBooks();
      this.fetchCategories();
    }
  },
  computed: {
    // 根据当前标签页显示不同的图书列表
    displayBooks: function displayBooks() {
      // 简化逻辑，只处理搜索模式和默认的推荐图书
      return this.isSearchMode ? this.searchResults : this.recommendedBooks;
    },
    borrowDate: function borrowDate() {
      var today = new Date();
      return today.toLocaleDateString();
    },
    calculatedDueDate: function calculatedDueDate() {
      var today = new Date();
      today.setDate(today.getDate() + this.borrowingDays);
      return today.toLocaleDateString();
    }
  },
  methods: {
    // 网格卡片的快捷操作（与现有借阅/预约API复用）
    borrowQuick: function borrowQuick(book) {
      this.selectedBook = book;
      this.borrowBook();
    },
    reserveQuick: function reserveQuick(book) {
      this.selectedBook = book;
      this.reserveBook();
    },
    handleBorrowingDeepLink: function handleBorrowingDeepLink(billno) {
      var _this = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var targetBorrowing;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _this.switchTab('history');
              case 2:
                // 2. 在加载完成的数据中查找对应的记录
                targetBorrowing = _this.myBorrowings.find(function (item) {
                  return item.billno === billno;
                }); // 3. 如果找到，则显示详情弹窗
                if (targetBorrowing) {
                  _this.viewBorrowingDetail(targetBorrowing);
                } else {
                  // 如果因为数据延迟等原因没找到，给个提示
                  uni.showToast({
                    title: '未找到单号为 ' + billno + ' 的借阅记录',
                    icon: 'none',
                    duration: 3000
                  });
                }
              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    },
    // 获取图书列表
    fetchBooks: function fetchBooks() {
      var _this2 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        var response;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                uni.showLoading({
                  title: '加载中...'
                });
                _context2.prev = 1;
                _context2.next = 4;
                return uni.request({
                  url: 'http://localhost:3000/api/book/list',
                  method: 'GET',
                  header: {
                    'Content-Type': 'application/json'
                  }
                });
              case 4:
                response = _context2.sent;
                if (response.statusCode === 200 && response.data.success) {
                  // 映射API数据到页面格式
                  _this2.recommendedBooks = response.data.data.map(function (book) {
                    return {
                      id: book.id,
                      title: book.title,
                      author: book.author,
                      publisher: book.publisher,
                      isbn: book.isbn,
                      cover: book.coverImage || '/static/images/book-placeholder.png',
                      tags: book.tags || ['综合'],
                      available: book.availableCopies > 0,
                      location: book.location,
                      description: book.description || '暂无简介',
                      availableCopies: book.availableCopies,
                      totalCopies: book.totalCopies,
                      category: book.category
                    };
                  });
                } else {
                  uni.showToast({
                    title: response.data.message || '获取图书列表失败',
                    icon: 'none'
                  });
                }
                _context2.next = 12;
                break;
              case 8:
                _context2.prev = 8;
                _context2.t0 = _context2["catch"](1);
                console.error("获取图书列表失败:", _context2.t0);
                uni.showToast({
                  title: '网络请求失败，请稍后重试',
                  icon: 'none'
                });
              case 12:
                _context2.prev = 12;
                uni.hideLoading();
                return _context2.finish(12);
              case 15:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[1, 8, 12, 15]]);
      }))();
    },
    // 获取我的借阅记录
    fetchMyBorrowings: function fetchMyBorrowings() {
      var _this3 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        var token, response;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _this3.isLoading = true;
                uni.showLoading({
                  title: '加载中...'
                });

                // 检查登录状态
                token = uni.getStorageSync('token');
                if (token) {
                  _context3.next = 8;
                  break;
                }
                uni.showToast({
                  title: '请先登录',
                  icon: 'none'
                });
                _this3.isLoading = false;
                uni.hideLoading();
                return _context3.abrupt("return");
              case 8:
                _context3.prev = 8;
                _context3.next = 11;
                return uni.request({
                  url: 'http://localhost:3000/api/book/borrowings/my',
                  method: 'GET',
                  header: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer ".concat(token)
                  }
                });
              case 11:
                response = _context3.sent;
                if (response.statusCode === 200 && response.data.success) {
                  _this3.myBorrowings = response.data.data.map(function (item) {
                    var dueDate = new Date(item.dueDate);
                    var now = new Date();
                    var isOverdue = now > dueDate;
                    var returned = item.status === 'returned';
                    var statusText = returned ? '已归还' : isOverdue ? '已到期' : '借阅中';
                    var statusClass = returned ? 'returned' : isOverdue ? 'overdue' : 'borrowing';
                    return {
                      id: item.id,
                      billno: item.borrowingNumber,
                      title: item.bookTitle,
                      author: item.bookAuthor,
                      cover: item.bookCover || '/static/images/book-placeholder.png',
                      borrowDate: new Date(item.borrowDate).toLocaleDateString(),
                      dueDate: dueDate.toLocaleDateString(),
                      location: item.bookLocation || '馆内-待补充',
                      status: item.status,
                      statusText: statusText,
                      statusClass: statusClass
                    };
                  });
                } else {
                  uni.showToast({
                    title: response.data.message || '获取借阅记录失败',
                    icon: 'none'
                  });
                  _this3.myBorrowings = [];
                }
                _context3.next = 19;
                break;
              case 15:
                _context3.prev = 15;
                _context3.t0 = _context3["catch"](8);
                console.error("获取借阅记录失败:", _context3.t0);
                uni.showToast({
                  title: '网络请求失败',
                  icon: 'none'
                });
              case 19:
                _context3.prev = 19;
                _this3.isLoading = false;
                uni.hideLoading();
                return _context3.finish(19);
              case 23:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[8, 15, 19, 23]]);
      }))();
    },
    // 获取图书分类
    fetchCategories: function fetchCategories() {
      var _this4 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4() {
        var response;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _context4.next = 3;
                return uni.request({
                  url: 'http://localhost:3000/api/book/categories/list',
                  method: 'GET',
                  header: {
                    'Content-Type': 'application/json'
                  }
                });
              case 3:
                response = _context4.sent;
                if (response.statusCode === 200 && response.data.success) {
                  _this4.categories = response.data.data;
                }
                _context4.next = 10;
                break;
              case 7:
                _context4.prev = 7;
                _context4.t0 = _context4["catch"](0);
                console.error('获取图书分类失败:', _context4.t0);
              case 10:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[0, 7]]);
      }))();
    },
    // 选择分类
    selectCategory: function selectCategory(category) {
      if (this.selectedCategory === category) {
        this.selectedCategory = null; // 取消选择
      } else {
        this.selectedCategory = category;
      }
      this.fetchBooksByCategory();
    },
    // 根据分类获取图书
    fetchBooksByCategory: function fetchBooksByCategory() {
      var _this5 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5() {
        var response;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (_this5.selectedCategory) {
                  _context5.next = 3;
                  break;
                }
                _this5.fetchBooks(); // 如果没有选择分类，获取推荐图书
                return _context5.abrupt("return");
              case 3:
                uni.showLoading({
                  title: '加载中...'
                });
                _context5.prev = 4;
                _context5.next = 7;
                return uni.request({
                  url: 'http://localhost:3000/api/book/list',
                  method: 'GET',
                  header: {
                    'Content-Type': 'application/json'
                  },
                  data: {
                    category: _this5.selectedCategory
                  }
                });
              case 7:
                response = _context5.sent;
                if (response.statusCode === 200 && response.data.success) {
                  _this5.recommendedBooks = response.data.data.map(function (book) {
                    return {
                      id: book.id,
                      title: book.title,
                      author: book.author,
                      publisher: book.publisher,
                      isbn: book.isbn,
                      cover: book.coverImage || '/static/images/book-placeholder.png',
                      tags: book.tags || ['综合'],
                      available: book.availableCopies > 0,
                      location: book.location,
                      description: book.description || '暂无简介',
                      availableCopies: book.availableCopies,
                      totalCopies: book.totalCopies,
                      category: book.category
                    };
                  });
                  _this5.isSearchMode = false;
                }
                _context5.next = 15;
                break;
              case 11:
                _context5.prev = 11;
                _context5.t0 = _context5["catch"](4);
                console.error('根据分类获取图书失败:', _context5.t0);
                uni.showToast({
                  title: '获取图书失败',
                  icon: 'none'
                });
              case 15:
                _context5.prev = 15;
                uni.hideLoading();
                return _context5.finish(15);
              case 18:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[4, 11, 15, 18]]);
      }))();
    },
    // 借阅图书
    borrowBook: function borrowBook() {
      var _this6 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6() {
        var token, borrowingData, response, errorMsg;
        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                // 检查登录状态
                token = uni.getStorageSync('token');
                if (token) {
                  _context6.next = 4;
                  break;
                }
                uni.showToast({
                  title: '请先登录',
                  icon: 'none'
                });
                return _context6.abrupt("return");
              case 4:
                uni.showLoading({
                  title: '正在提交...'
                });
                _context6.prev = 5;
                borrowingData = {
                  bookId: _this6.selectedBook.id,
                  borrowDays: _this6.borrowingDays,
                  notes: ''
                };
                _context6.next = 9;
                return uni.request({
                  url: 'http://localhost:3000/api/book/borrow',
                  method: 'POST',
                  header: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer ".concat(token)
                  },
                  data: borrowingData
                });
              case 9:
                response = _context6.sent;
                if (response.statusCode === 200 && response.data.success) {
                  uni.showToast({
                    title: '借阅成功!',
                    icon: 'success'
                  });
                  _this6.hideBookDetail();
                  // 借阅成功后刷新列表
                  _this6.fetchBooks();
                  // 刷新借阅记录
                  _this6.fetchMyBorrowings();
                } else {
                  errorMsg = response.data.message || '借阅失败';
                  uni.showToast({
                    title: errorMsg,
                    icon: 'none',
                    duration: 3000
                  });
                }
                _context6.next = 17;
                break;
              case 13:
                _context6.prev = 13;
                _context6.t0 = _context6["catch"](5);
                console.error('借阅请求失败:', _context6.t0);
                uni.showToast({
                  title: '请求异常，请稍后重试',
                  icon: 'none'
                });
              case 17:
                _context6.prev = 17;
                uni.hideLoading();
                return _context6.finish(17);
              case 20:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[5, 13, 17, 20]]);
      }))();
    },
    // 搜索图书
    searchBooks: function searchBooks() {
      var _this7 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee7() {
        var response;
        return _regenerator.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (_this7.searchKeyword.trim()) {
                  _context7.next = 3;
                  break;
                }
                _this7.isSearchMode = false;
                return _context7.abrupt("return");
              case 3:
                uni.showLoading({
                  title: '搜索中...'
                });
                _context7.prev = 4;
                _context7.next = 7;
                return uni.request({
                  url: 'http://localhost:3000/api/book/search',
                  method: 'GET',
                  header: {
                    'Content-Type': 'application/json'
                  },
                  data: {
                    keyword: _this7.searchKeyword.trim()
                  }
                });
              case 7:
                response = _context7.sent;
                if (response.statusCode === 200 && response.data.success) {
                  _this7.searchResults = response.data.data.map(function (book) {
                    return {
                      id: book.id,
                      title: book.title,
                      author: book.author,
                      publisher: book.publisher,
                      isbn: book.isbn,
                      cover: book.coverImage || '/static/images/book-placeholder.png',
                      tags: book.tags || ['综合'],
                      available: book.availableCopies > 0,
                      location: book.location,
                      description: book.description || '暂无简介',
                      availableCopies: book.availableCopies,
                      totalCopies: book.totalCopies,
                      category: book.category
                    };
                  });
                  _this7.isSearchMode = true;
                } else {
                  uni.showToast({
                    title: response.data.message || '搜索失败',
                    icon: 'none'
                  });
                }
                _context7.next = 15;
                break;
              case 11:
                _context7.prev = 11;
                _context7.t0 = _context7["catch"](4);
                console.error('搜索图书失败:', _context7.t0);
                uni.showToast({
                  title: '搜索失败，请稍后重试',
                  icon: 'none'
                });
              case 15:
                _context7.prev = 15;
                uni.hideLoading();
                return _context7.finish(15);
              case 18:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[4, 11, 15, 18]]);
      }))();
    },
    // 模拟搜索结果
    mockSearchResults: function mockSearchResults(keyword) {
      // 简单模拟，实际应用中会调用API进行搜索
      // 这里将所有图书数据合并后进行简单过滤
      var allBooks = [].concat((0, _toConsumableArray2.default)(this.recommendedBooks), (0, _toConsumableArray2.default)(this.searchResults));

      // 过滤符合关键词的图书
      return allBooks.filter(function (book) {
        var lowerKeyword = keyword.toLowerCase();
        return book.title.toLowerCase().includes(lowerKeyword) || book.author.toLowerCase().includes(lowerKeyword) || book.isbn.includes(keyword);
      });
    },
    // 扫描图书
    scanBook: function scanBook() {
      var _this8 = this;
      uni.scanCode({
        scanType: ['qrCode', 'barCode'],
        success: function success(res) {
          console.log('扫描结果：', res);

          // 判断是ISBN还是QR码
          if (res.result.length >= 10 && /^\d+$/.test(res.result)) {
            // 当作ISBN处理
            _this8.searchKeyword = res.result;
            _this8.searchBooks();
          } else {
            // 当作书架二维码处理
            _this8.startARNavigation();
          }
        }
      });
    },
    // 切换标签页
    switchTab: function switchTab(tab) {
      var _this9 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee8() {
        return _regenerator.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _this9.currentTab = tab;
                _this9.isSearchMode = false;
                _this9.searchKeyword = '';
                // 切换时按需加载数据
                if (!(tab === 'search' && _this9.recommendedBooks.length === 0)) {
                  _context8.next = 8;
                  break;
                }
                _context8.next = 6;
                return _this9.fetchBooks();
              case 6:
                _context8.next = 11;
                break;
              case 8:
                if (!(tab === 'history')) {
                  _context8.next = 11;
                  break;
                }
                _context8.next = 11;
                return _this9.fetchMyBorrowings();
              case 11:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }))();
    },
    // 查看图书详情
    viewBookDetail: function viewBookDetail(book) {
      this.selectedBook = book;
      this.borrowingDays = 30; // 每次打开弹窗时重置为默认值
      this.showBookDetail = true;
    },
    // 隐藏图书详情
    hideBookDetail: function hideBookDetail() {
      this.showBookDetail = false;
    },
    // 新增：显示/隐藏借阅详情
    viewBorrowingDetail: function viewBorrowingDetail(item) {
      this.selectedBorrowing = item;
      this.showBorrowDetail = true;
    },
    hideBorrowingDetail: function hideBorrowingDetail() {
      this.showBorrowDetail = false;
    },
    // 打开归还确认弹窗
    openReturnConfirm: function openReturnConfirm(item) {
      this.returnTargetLocation = item.location;
      this.returnTargetBorrowingId = item.id;
      this.showReturnConfirm = true;
    },
    // 关闭归还确认弹窗
    closeReturnConfirm: function closeReturnConfirm() {
      this.showReturnConfirm = false;
      this.returnTargetBorrowingId = null;
      this.returnTargetLocation = '';
    },
    // 执行归还
    performReturn: function performReturn() {
      var _this10 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee9() {
        var token, response;
        return _regenerator.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                token = uni.getStorageSync('token');
                if (token) {
                  _context9.next = 4;
                  break;
                }
                uni.showToast({
                  title: '请先登录',
                  icon: 'none'
                });
                return _context9.abrupt("return");
              case 4:
                if (_this10.returnTargetBorrowingId) {
                  _context9.next = 7;
                  break;
                }
                _this10.closeReturnConfirm();
                return _context9.abrupt("return");
              case 7:
                uni.showLoading({
                  title: '正在归还...'
                });
                _context9.prev = 8;
                _context9.next = 11;
                return uni.request({
                  url: "http://localhost:3000/api/book/return/".concat(_this10.returnTargetBorrowingId),
                  method: 'PUT',
                  header: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer ".concat(token)
                  },
                  data: {
                    returnDate: new Date().toISOString().split('T')[0]
                  }
                });
              case 11:
                response = _context9.sent;
                if (!(response.statusCode === 200 && response.data.success)) {
                  _context9.next = 19;
                  break;
                }
                uni.showToast({
                  title: '归还成功',
                  icon: 'success'
                });
                _this10.closeReturnConfirm();
                // 刷新历史列表
                _context9.next = 17;
                return _this10.fetchMyBorrowings();
              case 17:
                _context9.next = 20;
                break;
              case 19:
                uni.showToast({
                  title: response.data.message || '归还失败',
                  icon: 'none'
                });
              case 20:
                _context9.next = 26;
                break;
              case 22:
                _context9.prev = 22;
                _context9.t0 = _context9["catch"](8);
                console.error('归还失败:', _context9.t0);
                uni.showToast({
                  title: '网络异常，请稍后重试',
                  icon: 'none'
                });
              case 26:
                _context9.prev = 26;
                uni.hideLoading();
                return _context9.finish(26);
              case 29:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, null, [[8, 22, 26, 29]]);
      }))();
    },
    // 预约图书
    reserveBook: function reserveBook() {
      var _this11 = this;
      uni.showLoading({
        title: '处理中...'
      });
      setTimeout(function () {
        uni.hideLoading();
        uni.showModal({
          title: '预约成功',
          content: "\u60A8\u5DF2\u6210\u529F\u9884\u7EA6\u300A".concat(_this11.selectedBook.title, "\u300B\uFF0C\u56FE\u4E66\u5F52\u8FD8\u540E\u5C06\u901A\u77E5\u60A8\u3002"),
          showCancel: false,
          success: function success(res) {
            if (res.confirm) {
              _this11.hideBookDetail();
            }
          }
        });
      }, 1500);
    },
    // 定位图书位置
    locateBook: function locateBook() {
      this.hideBookDetail();
      this.startARNavigation();
    },
    // 显示筛选选项
    showFilterOptions: function showFilterOptions() {
      uni.showActionSheet({
        itemList: ['全部', '可借阅', '已借出', '文学类', '科技类'],
        success: function success(res) {
          uni.showToast({
            title: '已选择：' + ['全部', '可借阅', '已借出', '文学类', '科技类'][res.tapIndex],
            icon: 'none'
          });
        }
      });
    },
    // 启动AR导航
    startARNavigation: function startARNavigation() {
      // 实际应用中，这里应该请求相机权限并启动AR功能
      this.showARNavigation = true;
    },
    // 退出AR导航
    exitARNavigation: function exitARNavigation() {
      this.showARNavigation = false;
    }
  }
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ }),

/***/ 161:
/*!**********************************************************************************************************************!*\
  !*** D:/netease-codewave-competition/campus-life-system/pages/features/library.vue?vue&type=style&index=0&lang=css& ***!
  \**********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_node_modules_unplugin_vue2_script_setup_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue2_script_setup_library_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--6-oneOf-1-3!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!../../node_modules/unplugin-vue2-script-setup/node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue2-script-setup!./library.vue?vue&type=style&index=0&lang=css& */ 162);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_node_modules_unplugin_vue2_script_setup_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue2_script_setup_library_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_node_modules_unplugin_vue2_script_setup_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue2_script_setup_library_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_node_modules_unplugin_vue2_script_setup_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue2_script_setup_library_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_node_modules_unplugin_vue2_script_setup_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue2_script_setup_library_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_node_modules_unplugin_vue2_script_setup_node_modules_unplugin_dist_webpack_loaders_transform_js_unpluginName_unplugin_vue2_script_setup_library_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 162:
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!./node_modules/postcss-loader/src??ref--6-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/netease-codewave-competition/campus-life-system/node_modules/unplugin-vue2-script-setup/node_modules/unplugin/dist/webpack/loaders/transform.js?unpluginName=unplugin-vue2-script-setup!D:/netease-codewave-competition/campus-life-system/pages/features/library.vue?vue&type=style&index=0&lang=css& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[155,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/features/library.js.map