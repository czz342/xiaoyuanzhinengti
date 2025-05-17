(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/features/assessment-detail"],{

/***/ 124:
/*!*******************************************************************************!*\
  !*** D:/软件杯/校园智能体小程序/main.js?{"page":"pages%2Ffeatures%2Fassessment-detail"} ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, createPage) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
__webpack_require__(/*! uni-pages */ 26);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
var _assessmentDetail = _interopRequireDefault(__webpack_require__(/*! ./pages/features/assessment-detail.vue */ 125));
// @ts-ignore
wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;
createPage(_assessmentDetail.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["createPage"]))

/***/ }),

/***/ 125:
/*!************************************************************!*\
  !*** D:/软件杯/校园智能体小程序/pages/features/assessment-detail.vue ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _assessment_detail_vue_vue_type_template_id_080ed2a3___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./assessment-detail.vue?vue&type=template&id=080ed2a3& */ 126);
/* harmony import */ var _assessment_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./assessment-detail.vue?vue&type=script&lang=js& */ 128);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _assessment_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _assessment_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _assessment_detail_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./assessment-detail.vue?vue&type=style&index=0&lang=css& */ 130);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 32);

var renderjs





/* normalize component */

var component = Object(_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _assessment_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _assessment_detail_vue_vue_type_template_id_080ed2a3___WEBPACK_IMPORTED_MODULE_0__["render"],
  _assessment_detail_vue_vue_type_template_id_080ed2a3___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null,
  false,
  _assessment_detail_vue_vue_type_template_id_080ed2a3___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "pages/features/assessment-detail.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 126:
/*!*******************************************************************************************!*\
  !*** D:/软件杯/校园智能体小程序/pages/features/assessment-detail.vue?vue&type=template&id=080ed2a3& ***!
  \*******************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_assessment_detail_vue_vue_type_template_id_080ed2a3___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./assessment-detail.vue?vue&type=template&id=080ed2a3& */ 127);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_assessment_detail_vue_vue_type_template_id_080ed2a3___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_assessment_detail_vue_vue_type_template_id_080ed2a3___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_assessment_detail_vue_vue_type_template_id_080ed2a3___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_assessment_detail_vue_vue_type_template_id_080ed2a3___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 127:
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/软件杯/校园智能体小程序/pages/features/assessment-detail.vue?vue&type=template&id=080ed2a3& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
  var g0 = _vm.questions.length
  var g1 = _vm.questions.length
  _vm.$mp.data = Object.assign(
    {},
    {
      $root: {
        g0: g0,
        g1: g1,
      },
    }
  )
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 128:
/*!*************************************************************************************!*\
  !*** D:/软件杯/校园智能体小程序/pages/features/assessment-detail.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_assessment_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./assessment-detail.vue?vue&type=script&lang=js& */ 129);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_assessment_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_assessment_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_assessment_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_assessment_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_assessment_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 129:
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/软件杯/校园智能体小程序/pages/features/assessment-detail.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
      assessmentId: null,
      assessmentInfo: {},
      questions: [],
      currentIndex: 0,
      selectedOption: -1,
      answers: [],
      showCompletionPopup: false,
      // 示例问卷数据 - PHQ-9 抑郁筛查量表
      phq9: {
        id: 1,
        title: 'PHQ-9 抑郁症筛查量表',
        description: '在过去的两周内，您有多频繁地受到以下任何问题的困扰？',
        questions: [{
          id: 1,
          question: '做事时提不起劲或没有兴趣',
          options: [{
            text: '完全没有',
            score: 0
          }, {
            text: '有几天',
            score: 1
          }, {
            text: '一半以上天数',
            score: 2
          }, {
            text: '几乎每天',
            score: 3
          }]
        }, {
          id: 2,
          question: '感到心情低落、沮丧或绝望',
          options: [{
            text: '完全没有',
            score: 0
          }, {
            text: '有几天',
            score: 1
          }, {
            text: '一半以上天数',
            score: 2
          }, {
            text: '几乎每天',
            score: 3
          }]
        }, {
          id: 3,
          question: '入睡困难、睡不安稳或睡眠过多',
          options: [{
            text: '完全没有',
            score: 0
          }, {
            text: '有几天',
            score: 1
          }, {
            text: '一半以上天数',
            score: 2
          }, {
            text: '几乎每天',
            score: 3
          }]
        }, {
          id: 4,
          question: '感到疲倦或没有活力',
          options: [{
            text: '完全没有',
            score: 0
          }, {
            text: '有几天',
            score: 1
          }, {
            text: '一半以上天数',
            score: 2
          }, {
            text: '几乎每天',
            score: 3
          }]
        }, {
          id: 5,
          question: '食欲不振或过度饮食',
          options: [{
            text: '完全没有',
            score: 0
          }, {
            text: '有几天',
            score: 1
          }, {
            text: '一半以上天数',
            score: 2
          }, {
            text: '几乎每天',
            score: 3
          }]
        }, {
          id: 6,
          question: '对自己感到失望，或者觉得自己让家人失望',
          options: [{
            text: '完全没有',
            score: 0
          }, {
            text: '有几天',
            score: 1
          }, {
            text: '一半以上天数',
            score: 2
          }, {
            text: '几乎每天',
            score: 3
          }]
        }, {
          id: 7,
          question: '注意力不集中，做事情或阅读报纸有困难',
          options: [{
            text: '完全没有',
            score: 0
          }, {
            text: '有几天',
            score: 1
          }, {
            text: '一半以上天数',
            score: 2
          }, {
            text: '几乎每天',
            score: 3
          }]
        }, {
          id: 8,
          question: '行动或说话速度缓慢到别人已经注意到，或正好相反，烦躁或坐立不安、动来动去的情况更严重',
          options: [{
            text: '完全没有',
            score: 0
          }, {
            text: '有几天',
            score: 1
          }, {
            text: '一半以上天数',
            score: 2
          }, {
            text: '几乎每天',
            score: 3
          }]
        }, {
          id: 9,
          question: '有过不如死掉或用某种方式伤害自己的念头',
          options: [{
            text: '完全没有',
            score: 0
          }, {
            text: '有几天',
            score: 1
          }, {
            text: '一半以上天数',
            score: 2
          }, {
            text: '几乎每天',
            score: 3
          }]
        }]
      },
      // GAD-7 广泛性焦虑量表
      gad7: {
        id: 2,
        title: 'GAD-7 广泛性焦虑量表',
        description: '在过去的两周内，有多少天您被以下的问题所困扰？',
        questions: [{
          id: 1,
          question: '感到紧张、焦虑或急切',
          options: [{
            text: '完全没有',
            score: 0
          }, {
            text: '有几天',
            score: 1
          }, {
            text: '一半以上天数',
            score: 2
          }, {
            text: '几乎每天',
            score: 3
          }]
        }, {
          id: 2,
          question: '不能够停止或控制担忧',
          options: [{
            text: '完全没有',
            score: 0
          }, {
            text: '有几天',
            score: 1
          }, {
            text: '一半以上天数',
            score: 2
          }, {
            text: '几乎每天',
            score: 3
          }]
        }, {
          id: 3,
          question: '对各种各样的事情担忧过多',
          options: [{
            text: '完全没有',
            score: 0
          }, {
            text: '有几天',
            score: 1
          }, {
            text: '一半以上天数',
            score: 2
          }, {
            text: '几乎每天',
            score: 3
          }]
        }, {
          id: 4,
          question: '很难放松下来',
          options: [{
            text: '完全没有',
            score: 0
          }, {
            text: '有几天',
            score: 1
          }, {
            text: '一半以上天数',
            score: 2
          }, {
            text: '几乎每天',
            score: 3
          }]
        }, {
          id: 5,
          question: '由于不安而无法静坐',
          options: [{
            text: '完全没有',
            score: 0
          }, {
            text: '有几天',
            score: 1
          }, {
            text: '一半以上天数',
            score: 2
          }, {
            text: '几乎每天',
            score: 3
          }]
        }, {
          id: 6,
          question: '变得容易烦恼或易怒',
          options: [{
            text: '完全没有',
            score: 0
          }, {
            text: '有几天',
            score: 1
          }, {
            text: '一半以上天数',
            score: 2
          }, {
            text: '几乎每天',
            score: 3
          }]
        }, {
          id: 7,
          question: '感到害怕，好像有什么可怕的事情要发生',
          options: [{
            text: '完全没有',
            score: 0
          }, {
            text: '有几天',
            score: 1
          }, {
            text: '一半以上天数',
            score: 2
          }, {
            text: '几乎每天',
            score: 3
          }]
        }]
      }
    };
  },
  computed: {
    currentQuestion: function currentQuestion() {
      return this.questions[this.currentIndex] || {};
    },
    progress: function progress() {
      return this.currentIndex / this.questions.length * 100;
    }
  },
  onLoad: function onLoad(options) {
    this.assessmentId = options.id;
    this.loadAssessmentData();
  },
  methods: {
    // 加载问卷数据
    loadAssessmentData: function loadAssessmentData() {
      // 实际应用中应从服务器获取问卷数据
      // 这里使用示例数据
      if (this.assessmentId == 1) {
        this.assessmentInfo = {
          title: this.phq9.title,
          description: this.phq9.description
        };
        this.questions = this.phq9.questions;
      } else if (this.assessmentId == 2) {
        this.assessmentInfo = {
          title: this.gad7.title,
          description: this.gad7.description
        };
        this.questions = this.gad7.questions;
      }

      // 初始化答案数组
      this.answers = new Array(this.questions.length).fill(-1);
    },
    // 选择选项
    selectOption: function selectOption(index) {
      this.selectedOption = index;
      this.answers[this.currentIndex] = index;
    },
    // 上一题
    prevQuestion: function prevQuestion() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.selectedOption = this.answers[this.currentIndex];
      }
    },
    // 下一题或提交
    nextQuestion: function nextQuestion() {
      if (this.selectedOption === -1) return;
      this.answers[this.currentIndex] = this.selectedOption;
      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex++;
        this.selectedOption = this.answers[this.currentIndex];
      } else {
        // 提交问卷
        this.submitAssessment();
      }
    },
    // 提交问卷
    submitAssessment: function submitAssessment() {
      var _this = this;
      this.showCompletionPopup = true;

      // 计算得分
      var totalScore = 0;
      this.answers.forEach(function (answerIndex, questionIndex) {
        var question = _this.questions[questionIndex];
        var option = question.options[answerIndex];
        totalScore += option.score;
      });

      // 生成报告内容
      var report = this.generateReport(totalScore);

      // 保存报告
      setTimeout(function () {
        // 实际应用中应将报告保存到服务器
        uni.redirectTo({
          url: "/pages/features/report-detail?id=".concat(_this.assessmentId, "&score=").concat(totalScore)
        });
      }, 2000);
    },
    // 生成报告内容
    generateReport: function generateReport(score) {
      var report = {
        assessmentId: this.assessmentId,
        title: this.assessmentInfo.title,
        score: score,
        date: new Date().toISOString().split('T')[0],
        level: '',
        summary: '',
        recommendations: []
      };

      // PHQ-9 评分解释
      if (this.assessmentId == 1) {
        if (score <= 4) {
          report.level = '无或极轻度抑郁';
          report.summary = '您的抑郁症状评分为无或极轻度，目前状态良好。';
          report.recommendations = ['保持健康的生活方式', '规律作息，保证充足睡眠', '持续锻炼身体，每周至少150分钟中等强度运动'];
        } else if (score <= 9) {
          report.level = '轻度抑郁';
          report.summary = '您的抑郁症状评分为轻度，建议关注情绪变化，保持规律作息和适当运动。';
          report.recommendations = ['保持规律的作息时间', '每天进行30分钟有氧运动', '学习简单的放松技巧', '与朋友保持社交联系'];
        } else if (score <= 14) {
          report.level = '中度抑郁';
          report.summary = '您的抑郁症状评分为中度，建议采取措施改善情绪，必要时寻求专业帮助。';
          report.recommendations = ['建议预约校内心理咨询师', '学习认知行为技巧来应对消极思维', '保持社交活动，避免孤独', '确保规律作息和健康饮食'];
        } else if (score <= 19) {
          report.level = '中重度抑郁';
          report.summary = '您的抑郁症状评分为中重度，建议尽快寻求专业心理咨询帮助。';
          report.recommendations = ['尽快预约校内心理咨询师', '告知信任的朋友或家人您的感受', '减轻学业压力，适当调整计划', '规律作息，避免熬夜'];
        } else {
          report.level = '重度抑郁';
          report.summary = '您的抑郁症状评分为重度，强烈建议立即寻求专业心理健康服务。';
          report.recommendations = ['立即联系校内心理咨询中心或医院精神科', '不要独处，告知家人或密友', '暂时减少压力源', '遵循专业人士的建议和治疗计划'];
        }
      }
      // GAD-7 评分解释
      else if (this.assessmentId == 2) {
        if (score <= 4) {
          report.level = '无焦虑';
          report.summary = '您的焦虑症状评分为无或极轻度，目前状态良好。';
          report.recommendations = ['保持健康的生活方式', '继续使用有效的压力管理策略', '定期进行放松活动'];
        } else if (score <= 9) {
          report.level = '轻度焦虑';
          report.summary = '您的焦虑症状评分为轻度，建议关注压力管理和放松技巧。';
          report.recommendations = ['学习呼吸放松技巧', '每天进行15分钟正念冥想', '保持规律作息', '适当运动缓解压力'];
        } else if (score <= 14) {
          report.level = '中度焦虑';
          report.summary = '您的焦虑症状评分为中度，建议学习焦虑管理技巧，必要时寻求专业帮助。';
          report.recommendations = ['建议预约校内心理咨询师', '学习认知行为技巧来应对焦虑思维', '减少咖啡因等刺激物摄入', '建立规律的日常计划，减少不确定性'];
        } else {
          report.level = '重度焦虑';
          report.summary = '您的焦虑症状评分为重度，建议尽快寻求专业心理咨询帮助。';
          report.recommendations = ['尽快预约校内心理咨询师', '与亲友分享您的感受', '减少压力源', '学习并实践焦虑管理技巧'];
        }
      }
      return report;
    }
  }
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ }),

/***/ 130:
/*!*********************************************************************************************!*\
  !*** D:/软件杯/校园智能体小程序/pages/features/assessment-detail.vue?vue&type=style&index=0&lang=css& ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_assessment_detail_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--6-oneOf-1-3!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./assessment-detail.vue?vue&type=style&index=0&lang=css& */ 131);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_assessment_detail_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_assessment_detail_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_assessment_detail_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_assessment_detail_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_assessment_detail_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 131:
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!./node_modules/postcss-loader/src??ref--6-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/软件杯/校园智能体小程序/pages/features/assessment-detail.vue?vue&type=style&index=0&lang=css& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[124,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/features/assessment-detail.js.map