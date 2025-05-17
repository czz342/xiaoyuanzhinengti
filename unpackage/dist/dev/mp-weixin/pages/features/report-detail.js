(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/features/report-detail"],{

/***/ 132:
/*!***************************************************************************!*\
  !*** D:/软件杯/校园智能体小程序/main.js?{"page":"pages%2Ffeatures%2Freport-detail"} ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, createPage) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
__webpack_require__(/*! uni-pages */ 26);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
var _reportDetail = _interopRequireDefault(__webpack_require__(/*! ./pages/features/report-detail.vue */ 133));
// @ts-ignore
wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;
createPage(_reportDetail.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["createPage"]))

/***/ }),

/***/ 133:
/*!********************************************************!*\
  !*** D:/软件杯/校园智能体小程序/pages/features/report-detail.vue ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _report_detail_vue_vue_type_template_id_38cd1871___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./report-detail.vue?vue&type=template&id=38cd1871& */ 134);
/* harmony import */ var _report_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./report-detail.vue?vue&type=script&lang=js& */ 136);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _report_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _report_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _report_detail_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./report-detail.vue?vue&type=style&index=0&lang=css& */ 138);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 32);

var renderjs





/* normalize component */

var component = Object(_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _report_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _report_detail_vue_vue_type_template_id_38cd1871___WEBPACK_IMPORTED_MODULE_0__["render"],
  _report_detail_vue_vue_type_template_id_38cd1871___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null,
  false,
  _report_detail_vue_vue_type_template_id_38cd1871___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "pages/features/report-detail.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 134:
/*!***************************************************************************************!*\
  !*** D:/软件杯/校园智能体小程序/pages/features/report-detail.vue?vue&type=template&id=38cd1871& ***!
  \***************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_report_detail_vue_vue_type_template_id_38cd1871___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./report-detail.vue?vue&type=template&id=38cd1871& */ 135);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_report_detail_vue_vue_type_template_id_38cd1871___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_report_detail_vue_vue_type_template_id_38cd1871___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_report_detail_vue_vue_type_template_id_38cd1871___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_report_detail_vue_vue_type_template_id_38cd1871___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 135:
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/软件杯/校园智能体小程序/pages/features/report-detail.vue?vue&type=template&id=38cd1871& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return recyclableRender; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "components", function() { return components; });
var render = function () {}
var staticRenderFns = []
var recyclableRender
var components



/***/ }),

/***/ 136:
/*!*********************************************************************************!*\
  !*** D:/软件杯/校园智能体小程序/pages/features/report-detail.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_report_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./report-detail.vue?vue&type=script&lang=js& */ 137);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_report_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_report_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_report_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_report_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_report_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 137:
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/软件杯/校园智能体小程序/pages/features/report-detail.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
      score: 0,
      reportData: {
        title: '',
        date: '',
        score: 0,
        level: '',
        summary: '',
        recommendations: []
      },
      // PHQ-9 评分等级
      phq9Levels: [{
        name: '无或极轻度抑郁',
        range: '0-4',
        color: '#52C41A'
      }, {
        name: '轻度抑郁',
        range: '5-9',
        color: '#FAAD14'
      }, {
        name: '中度抑郁',
        range: '10-14',
        color: '#FA8C16'
      }, {
        name: '中重度抑郁',
        range: '15-19',
        color: '#F5222D'
      }, {
        name: '重度抑郁',
        range: '20-27',
        color: '#A8071A'
      }],
      // GAD-7 评分等级
      gad7Levels: [{
        name: '无焦虑',
        range: '0-4',
        color: '#52C41A'
      }, {
        name: '轻度焦虑',
        range: '5-9',
        color: '#FAAD14'
      }, {
        name: '中度焦虑',
        range: '10-14',
        color: '#FA8C16'
      }, {
        name: '重度焦虑',
        range: '15-21',
        color: '#F5222D'
      }],
      // 相关资源
      depression_resources: [{
        title: '抑郁自助指南',
        description: '了解如何通过自助方式改善抑郁症状',
        icon: '/static/images/guide.png',
        url: ''
      }, {
        title: '正念冥想练习',
        description: '音频引导的冥想练习，帮助缓解抑郁情绪',
        icon: '/static/images/meditation.png',
        url: ''
      }, {
        title: '认知行为练习',
        description: '学习识别和挑战消极思维模式',
        icon: '/static/images/cbt.png',
        url: ''
      }],
      anxiety_resources: [{
        title: '焦虑管理技巧',
        description: '实用的方法来应对和减轻焦虑症状',
        icon: '/static/images/tips.png',
        url: ''
      }, {
        title: '呼吸放松练习',
        description: '简单有效的呼吸技巧，快速缓解焦虑',
        icon: '/static/images/breathing.png',
        url: ''
      }, {
        title: '压力管理指南',
        description: '学习如何识别压力源并有效管理压力',
        icon: '/static/images/stress.png',
        url: ''
      }]
    };
  },
  computed: {
    scoreLevels: function scoreLevels() {
      return this.assessmentId == 1 ? this.phq9Levels : this.gad7Levels;
    },
    relevantResources: function relevantResources() {
      return this.assessmentId == 1 ? this.depression_resources : this.anxiety_resources;
    }
  },
  onLoad: function onLoad(options) {
    this.assessmentId = options.id;
    this.score = options.score;
    this.loadReportData();
  },
  onReady: function onReady() {
    this.drawScoreChart();
  },
  methods: {
    // 加载报告数据
    loadReportData: function loadReportData() {
      // 实际应用中应从服务器获取报告数据
      this.reportData.score = this.score;
      this.reportData.date = new Date().toISOString().split('T')[0];

      // PHQ-9 抑郁量表
      if (this.assessmentId == 1) {
        this.reportData.title = 'PHQ-9 抑郁症筛查量表';
        if (this.score <= 4) {
          this.reportData.level = '无或极轻度抑郁';
          this.reportData.summary = '您的抑郁症状评分为无或极轻度，目前状态良好。';
          this.reportData.recommendations = ['保持健康的生活方式', '规律作息，保证充足睡眠', '持续锻炼身体，每周至少150分钟中等强度运动'];
        } else if (this.score <= 9) {
          this.reportData.level = '轻度抑郁';
          this.reportData.summary = '您的抑郁症状评分为轻度，建议关注情绪变化，保持规律作息和适当运动。';
          this.reportData.recommendations = ['保持规律的作息时间', '每天进行30分钟有氧运动', '学习简单的放松技巧', '与朋友保持社交联系'];
        } else if (this.score <= 14) {
          this.reportData.level = '中度抑郁';
          this.reportData.summary = '您的抑郁症状评分为中度，建议采取措施改善情绪，必要时寻求专业帮助。';
          this.reportData.recommendations = ['建议预约校内心理咨询师', '学习认知行为技巧来应对消极思维', '保持社交活动，避免孤独', '确保规律作息和健康饮食'];
        } else if (this.score <= 19) {
          this.reportData.level = '中重度抑郁';
          this.reportData.summary = '您的抑郁症状评分为中重度，建议尽快寻求专业心理咨询帮助。';
          this.reportData.recommendations = ['尽快预约校内心理咨询师', '告知信任的朋友或家人您的感受', '减轻学业压力，适当调整计划', '规律作息，避免熬夜'];
        } else {
          this.reportData.level = '重度抑郁';
          this.reportData.summary = '您的抑郁症状评分为重度，强烈建议立即寻求专业心理咨询帮助。';
          this.reportData.recommendations = ['立即联系校内心理咨询中心或医院精神科', '不要独处，告知家人或密友', '暂时减少压力源', '遵循专业人士的建议和治疗计划'];
        }
      }
      // GAD-7 焦虑量表
      else if (this.assessmentId == 2) {
        this.reportData.title = 'GAD-7 广泛性焦虑量表';
        if (this.score <= 4) {
          this.reportData.level = '无焦虑';
          this.reportData.summary = '您的焦虑症状评分为无或极轻度，目前状态良好。';
          this.reportData.recommendations = ['保持健康的生活方式', '继续使用有效的压力管理策略', '定期进行放松活动'];
        } else if (this.score <= 9) {
          this.reportData.level = '轻度焦虑';
          this.reportData.summary = '您的焦虑症状评分为轻度，建议关注压力管理和放松技巧。';
          this.reportData.recommendations = ['学习呼吸放松技巧', '每天进行15分钟正念冥想', '保持规律作息', '适当运动缓解压力'];
        } else if (this.score <= 14) {
          this.reportData.level = '中度焦虑';
          this.reportData.summary = '您的焦虑症状评分为中度，建议学习焦虑管理技巧，必要时寻求专业帮助。';
          this.reportData.recommendations = ['建议预约校内心理咨询师', '学习认知行为技巧来应对焦虑思维', '减少咖啡因等刺激物摄入', '建立规律的日常计划，减少不确定性'];
        } else {
          this.reportData.level = '重度焦虑';
          this.reportData.summary = '您的焦虑症状评分为重度，建议尽快寻求专业心理咨询帮助。';
          this.reportData.recommendations = ['尽快预约校内心理咨询师', '与亲友分享您的感受', '减少压力源', '学习并实践焦虑管理技巧'];
        }
      }
    },
    // 根据级别获取对应的CSS类
    getLevelClass: function getLevelClass(level) {
      if (level.includes('无') || level.includes('极轻度')) {
        return 'level-none';
      } else if (level.includes('轻度')) {
        return 'level-mild';
      } else if (level.includes('中度') && !level.includes('重')) {
        return 'level-moderate';
      } else if (level.includes('中重度')) {
        return 'level-moderately-severe';
      } else if (level.includes('重度')) {
        return 'level-severe';
      }
      return '';
    },
    // 根据级别获取颜色
    getColorByLevel: function getColorByLevel(level) {
      if (level.includes('无') || level.includes('极轻度')) {
        return '#52C41A';
      } else if (level.includes('轻度')) {
        return '#FAAD14';
      } else if (level.includes('中度') && !level.includes('重')) {
        return '#FA8C16';
      } else if (level.includes('中重度')) {
        return '#F5222D';
      } else if (level.includes('重度')) {
        return '#A8071A';
      }
      return '#666';
    },
    // 绘制得分图表
    drawScoreChart: function drawScoreChart() {
      // 注意：uni-app 的 canvas API 与微信小程序相同，但在实际应用中可能需要额外引入图表库
      // 这里仅给出一个简单的示例，实际应用建议使用 echarts 等图表库
      var ctx = uni.createCanvasContext('scoreChart', this);
      var canvasWidth = 300;
      var canvasHeight = 150;

      // 绘制背景
      ctx.beginPath();
      ctx.rect(0, 0, canvasWidth, canvasHeight);
      ctx.setFillStyle('#f5f5f5');
      ctx.fill();

      // 计算得分的位置
      var maxScore = this.assessmentId == 1 ? 27 : 21;
      var scorePosition = this.score / maxScore * canvasWidth;

      // 绘制等级区域
      var levels = this.scoreLevels;
      var startX = 0;
      levels.forEach(function (level, index) {
        var rangeArr = level.range.split('-');
        var start = parseInt(rangeArr[0]);
        var end = parseInt(rangeArr[1]);
        var width = (end - start + 1) / maxScore * canvasWidth;
        ctx.beginPath();
        ctx.rect(startX, 30, width, 40);
        ctx.setFillStyle(level.color);
        ctx.fill();
        startX += width;
      });

      // 绘制得分指示器
      ctx.beginPath();
      ctx.moveTo(scorePosition, 20);
      ctx.lineTo(scorePosition - 10, 0);
      ctx.lineTo(scorePosition + 10, 0);
      ctx.closePath();
      ctx.setFillStyle('#333');
      ctx.fill();

      // 绘制分数文字
      ctx.setFontSize(14);
      ctx.setFillStyle('#333');
      ctx.setTextAlign('center');
      ctx.fillText("\u5F97\u5206: ".concat(this.score), scorePosition, 15);

      // 绘制
      ctx.draw();
    },
    // 获取详细分析文本
    getAnalysisText: function getAnalysisText() {
      if (this.assessmentId == 1) {
        // PHQ-9
        if (this.score <= 4) {
          return "您目前的抑郁症状评分处于'无或极轻度'范围，表明您近期情绪状态良好，没有明显的抑郁症状。建议您继续保持健康的生活方式，规律作息，适当运动，保持良好的社交活动。";
        } else if (this.score <= 9) {
          return "您目前的抑郁症状评分处于'轻度'范围，表明您可能有一些情绪低落或兴趣减退的症状，但通常不会明显影响日常功能。建议您关注情绪变化，保持规律作息和适当运动，学习一些简单的情绪管理技巧，如果症状持续或加重，可以考虑寻求专业帮助。";
        } else if (this.score <= 14) {
          return "您目前的抑郁症状评分处于'中度'范围，表明您可能正在经历明显的抑郁症状，如持续的情绪低落、兴趣减退、睡眠问题等。这些症状可能已经对您的日常生活和学习产生一定影响。建议您采取积极措施改善情绪，如规律作息、适当运动、保持社交活动，同时考虑寻求校内心理咨询师的专业帮助。";
        } else if (this.score <= 19) {
          return "您目前的抑郁症状评分处于'中重度'范围，表明您可能正在经历较为严重的抑郁症状，这些症状很可能已经明显影响了您的日常功能和生活质量。强烈建议您尽快寻求专业心理咨询帮助，同时告知信任的朋友或家人您的感受，减轻学业压力，适当调整计划，确保规律作息。";
        } else {
          return "您目前的抑郁症状评分处于'重度'范围，表明您可能正在经历严重的抑郁症状，这些症状很可能已经严重影响了您的日常生活功能。强烈建议您立即联系校内心理咨询中心或医院精神科寻求专业帮助，不要独处，告知家人或密友，暂时减少压力源，并遵循专业人士的建议和治疗计划。";
        }
      } else if (this.assessmentId == 2) {
        // GAD-7
        if (this.score <= 4) {
          return "您目前的焦虑症状评分处于'无焦虑'范围，表明您近期情绪状态稳定，没有明显的焦虑症状。建议您继续保持健康的生活方式，继续使用有效的压力管理策略，定期进行放松活动。";
        } else if (this.score <= 9) {
          return "您目前的焦虑症状评分处于'轻度焦虑'范围，表明您可能有一些担忧和紧张感，但通常不会明显影响日常功能。建议您学习一些呼吸放松技巧，每天进行短时正念冥想，保持规律作息，适当运动缓解压力。";
        } else if (this.score <= 14) {
          return "您目前的焦虑症状评分处于'中度焦虑'范围，表明您可能正在经历明显的焦虑症状，如过度担忧、紧张不安、难以放松等。这些症状可能已经对您的日常生活和学习产生一定影响。建议您学习焦虑管理技巧，减少咖啡因等刺激物摄入，建立规律的日常计划，同时考虑寻求校内心理咨询师的专业帮助。";
        } else {
          return "您目前的焦虑症状评分处于'重度焦虑'范围，表明您可能正在经历严重的焦虑症状，这些症状很可能已经明显影响了您的日常功能和生活质量。强烈建议您尽快寻求专业心理咨询帮助，同时与亲友分享您的感受，减少压力源，学习并实践焦虑管理技巧。";
        }
      }
      return "";
    },
    // 分享报告
    shareReport: function shareReport() {
      uni.showToast({
        title: '分享功能开发中',
        icon: 'none'
      });
    },
    // 下载/保存报告
    downloadReport: function downloadReport() {
      uni.showToast({
        title: '报告已保存',
        icon: 'success'
      });
    },
    // 打开资源
    openResource: function openResource(resource) {
      uni.showToast({
        title: '正在打开: ' + resource.title,
        icon: 'none'
      });
    },
    // 预约咨询
    bookConsultation: function bookConsultation() {
      uni.navigateTo({
        url: '/pages/features/psychological-assessment?tab=2'
      });
    },
    // 重新测评
    retakeAssessment: function retakeAssessment() {
      uni.navigateTo({
        url: "/pages/features/assessment-detail?id=".concat(this.assessmentId)
      });
    }
  }
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ }),

/***/ 138:
/*!*****************************************************************************************!*\
  !*** D:/软件杯/校园智能体小程序/pages/features/report-detail.vue?vue&type=style&index=0&lang=css& ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_report_detail_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--6-oneOf-1-3!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./report-detail.vue?vue&type=style&index=0&lang=css& */ 139);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_report_detail_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_report_detail_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_report_detail_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_report_detail_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_report_detail_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 139:
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!./node_modules/postcss-loader/src??ref--6-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/软件杯/校园智能体小程序/pages/features/report-detail.vue?vue&type=style&index=0&lang=css& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[132,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/features/report-detail.js.map