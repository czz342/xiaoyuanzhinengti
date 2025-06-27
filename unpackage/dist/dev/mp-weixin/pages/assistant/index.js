(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/assistant/index"],{

/***/ 34:
/*!********************************************************************!*\
  !*** D:/软件杯/校园智能体小程序/main.js?{"page":"pages%2Fassistant%2Findex"} ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, createPage) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
__webpack_require__(/*! uni-pages */ 26);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
var _index = _interopRequireDefault(__webpack_require__(/*! ./pages/assistant/index.vue */ 35));
// @ts-ignore
wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;
createPage(_index.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["createPage"]))

/***/ }),

/***/ 35:
/*!*************************************************!*\
  !*** D:/软件杯/校园智能体小程序/pages/assistant/index.vue ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_411d5278_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=411d5278&scoped=true& */ 36);
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js& */ 38);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _index_vue_vue_type_style_index_0_id_411d5278_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.vue?vue&type=style&index=0&id=411d5278&scoped=true&lang=css& */ 45);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 32);

var renderjs





/* normalize component */

var component = Object(_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_411d5278_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _index_vue_vue_type_template_id_411d5278_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "411d5278",
  null,
  false,
  _index_vue_vue_type_template_id_411d5278_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "pages/assistant/index.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 36:
/*!********************************************************************************************!*\
  !*** D:/软件杯/校园智能体小程序/pages/assistant/index.vue?vue&type=template&id=411d5278&scoped=true& ***!
  \********************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_template_id_411d5278_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./index.vue?vue&type=template&id=411d5278&scoped=true& */ 37);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_template_id_411d5278_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_template_id_411d5278_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_template_id_411d5278_scoped_true___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_template_id_411d5278_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 37:
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/软件杯/校园智能体小程序/pages/assistant/index.vue?vue&type=template&id=411d5278&scoped=true& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
  var l1 = _vm.__map(_vm.chatMessages, function (msg, index) {
    var $orig = _vm.__get_orig(msg)
    var l0 =
      !(msg.type === "user" || msg.type === "system") &&
      msg.type === "thinking_process" &&
      msg.isThinkingVisible
        ? _vm.__map(msg.steps, function (step, stepIndex) {
            var $orig = _vm.__get_orig(step)
            var m0 = _vm.getStepIcon(step.type)
            return {
              $orig: $orig,
              m0: m0,
            }
          })
        : null
    return {
      $orig: $orig,
      l0: l0,
    }
  })
  var g0 = _vm.ongoingTasks.length
  _vm.$mp.data = Object.assign(
    {},
    {
      $root: {
        l1: l1,
        g0: g0,
      },
    }
  )
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 38:
/*!**************************************************************************!*\
  !*** D:/软件杯/校园智能体小程序/pages/assistant/index.vue?vue&type=script&lang=js& ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./index.vue?vue&type=script&lang=js& */ 39);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 39:
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/软件杯/校园智能体小程序/pages/assistant/index.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ 40));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ 13));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ 42));
var _kingdeeAgent = _interopRequireDefault(__webpack_require__(/*! @/services/kingdeeAgent */ 43));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var _default = {
  data: function data() {
    return {
      // !!!重要!!!: 每次启动cloudflared后，请在这里更新为新的公网地址
      tunnelUrl: "https://solving-titans-roads-seekers.trycloudflare.com",
      inputMessage: '',
      scrollTop: 0,
      userAvatar: '/static/images/avatar.png',
      botAvatar: '/static/images/assistant.png',
      chatMessages: [{
        type: 'system',
        content: '您好！我是校园智能体，有什么可以帮助您的吗？'
      }],
      quickAccessItems: [{
        icon: '/static/images/schedule.png',
        text: '查课表',
        path: '/pages/features/schedule'
      }, {
        icon: '/static/images/food.png',
        text: '订餐',
        path: '/pages/features/food'
      }, {
        icon: '/static/images/library.png',
        text: '借书',
        path: '/pages/features/library'
      }, {
        icon: '/static/images/classroom.png',
        text: '教室预约',
        path: '/pages/features/classroom'
      }, {
        icon: '/static/images/express.png',
        text: '快递',
        path: '/pages/features/express'
      }],
      ongoingTasks: [{
        id: 'task1',
        icon: '/static/images/icon-repair.png',
        title: '宿舍报修',
        description: '水管漏水，请求处理',
        progress: 75,
        remainingTime: '2小时',
        status: 'processing',
        statusText: '处理中',
        path: '/pages/tasks/detail?id=task1'
      }, {
        id: 'task2',
        icon: '/static/images/icon-express.png',
        title: '快递代取',
        description: '京东快递，请尽快处理',
        progress: 25,
        remainingTime: '30分钟',
        status: 'waiting',
        statusText: '待领取',
        path: '/pages/tasks/detail?id=task2'
      }, {
        id: 'task3',
        icon: '/static/images/icon-library.png',
        title: '图书续借',
        description: '《深入理解计算机系统》',
        progress: 90,
        remainingTime: '1天',
        status: 'processing',
        statusText: '即将到期',
        path: '/pages/tasks/detail?id=task3'
      }],
      sessionId: null,
      currentTaskId: null,
      isAssistantTyping: false,
      assistants: [],
      selectedAssistant: null,
      activeSkill: {
        id: null,
        type: null
      },
      websocketTask: null,
      websocketConnected: false,
      reconnectInterval: null,
      heartbeatInterval: null // 新增：心跳定时器
    };
  },
  onLoad: function onLoad() {
    var _this = this;
    return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              console.log('页面加载开始');
              _context.prev = 1;
              _context.next = 4;
              return _this.initializeAssistant();
            case 4:
              // 初始化成功后，连接WebSocket
              _this.connectWebSocket();
              console.log('页面初始化与WebSocket连接流程启动');
              _context.next = 12;
              break;
            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](1);
              console.error('页面初始化失败:', _context.t0);
              uni.showToast({
                title: '初始化失败，请重试',
                icon: 'none'
              });
            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[1, 8]]);
    }))();
  },
  methods: {
    initializeAssistant: function initializeAssistant() {
      var _this2 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        var assistantsResponse, targetAssistantId, targetAssistantName, foundAssistant, assistantIdToUse, callbackUrlToUse, sessionResponse, firstSkill, errMsg;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                console.log('开始初始化AI助手');
                _context2.prev = 1;
                uni.showLoading({
                  title: '正在初始化...'
                });

                // 获取助手列表
                console.log('正在获取助手列表...');
                _context2.next = 6;
                return _kingdeeAgent.default.getAssistants();
              case 6:
                assistantsResponse = _context2.sent;
                console.log('获取到的助手列表:', assistantsResponse);
                if (!(!assistantsResponse || !assistantsResponse.data || !Array.isArray(assistantsResponse.data) || !assistantsResponse.data.length)) {
                  _context2.next = 11;
                  break;
                }
                console.error('助手列表无效或为空:', assistantsResponse);
                throw new Error('获取助手列表失败或列表为空');
              case 11:
                _this2.assistants = assistantsResponse.data;
                if (!(_this2.assistants && _this2.assistants.length > 0)) {
                  _context2.next = 46;
                  break;
                }
                // 目标助手的ID和名称
                targetAssistantId = "2224845143255547904";
                targetAssistantName = "校园助手"; // 尝试通过ID查找助手，如果找不到，再尝试通过名称查找
                foundAssistant = _this2.assistants.find(function (assistant) {
                  return assistant.id === targetAssistantId;
                });
                if (!foundAssistant) {
                  console.warn("\u672A\u901A\u8FC7ID \"".concat(targetAssistantId, "\" \u627E\u5230\u52A9\u624B\uFF0C\u5C1D\u8BD5\u901A\u8FC7\u540D\u79F0 \"").concat(targetAssistantName, "\" \u67E5\u627E..."));
                  foundAssistant = _this2.assistants.find(function (assistant) {
                    return assistant.name === targetAssistantName;
                  });
                }
                if (foundAssistant) {
                  _this2.selectedAssistant = foundAssistant;
                } else {
                  console.warn("\u4E5F\u672A\u901A\u8FC7\u540D\u79F0 \"".concat(targetAssistantName, "\" \u627E\u5230\u52A9\u624B\uFF0C\u5C06\u9ED8\u8BA4\u4F7F\u7528\u5217\u8868\u4E2D\u7684\u7B2C\u4E00\u4E2A\u52A9\u624B\u3002"));
                  _this2.selectedAssistant = _this2.assistants[0]; // 如果特定助手未找到，回退到第一个
                }

                console.log('已选择助手:', JSON.parse(JSON.stringify(_this2.selectedAssistant)));

                // 更新欢迎消息等
                _this2.chatMessages.unshift({
                  type: 'system',
                  content: _this2.selectedAssistant.openingSpeech || "\u60A8\u597D\uFF0C\u6211\u662F\u60A8\u7684\u52A9\u624B ".concat(_this2.selectedAssistant.name, "\uFF0C\u6709\u4EC0\u4E48\u53EF\u4EE5\u5E2E\u52A9\u60A8\u7684\u5417\uFF1F"),
                  timestamp: Date.now()
                });
                uni.showLoading({
                  title: '正在创建新会话...'
                });

                // 从选中的助手中获取 assistantId
                assistantIdToUse = _this2.selectedAssistant.id; // 将回调URL指向我们的cloudflared服务器
                callbackUrlToUse = "".concat(_this2.tunnelUrl, "/webhook");
                if (assistantIdToUse) {
                  _context2.next = 26;
                  break;
                }
                console.error("无法从selectedAssistant中获取有效的ID!");
                throw new Error("无法初始化会话：助手ID缺失。");
              case 26:
                console.log("\u51C6\u5907\u8C03\u7528createSession\uFF0CassistantId: ".concat(assistantIdToUse, ", callbackUrl: ").concat(callbackUrlToUse));
                _context2.next = 29;
                return _kingdeeAgent.default.createSession(assistantIdToUse, callbackUrlToUse);
              case 29:
                sessionResponse = _context2.sent;
                console.log('创建会话响应 (原始):', JSON.parse(JSON.stringify(sessionResponse))); // 使用深拷贝打印

                // 在判断前打印关键值及其类型
                console.log('DEBUG: sessionResponse object:', sessionResponse);
                if (sessionResponse) {
                  console.log('DEBUG: sessionResponse.status:', sessionResponse.status, 'type:', (0, _typeof2.default)(sessionResponse.status));
                  console.log('DEBUG: sessionResponse.data object:', sessionResponse.data);
                  if (sessionResponse.data) {
                    console.log('DEBUG: sessionResponse.data.sessionId:', sessionResponse.data.sessionId, 'type:', (0, _typeof2.default)(sessionResponse.data.sessionId));
                    // 额外检查sessionId是否为空字符串或布尔false
                    console.log('DEBUG: sessionResponse.data.sessionId === "":', sessionResponse.data.sessionId === "");
                    console.log('DEBUG: sessionResponse.data.sessionId === false:', sessionResponse.data.sessionId === false);
                    console.log('DEBUG: !!sessionResponse.data.sessionId:', !!sessionResponse.data.sessionId);
                  }
                }

                // 修正并增强判断条件
                if (!(sessionResponse && sessionResponse.status &&
                // 检查 status 是否为真值 (true, "true", 1 等都会通过)
                sessionResponse.data && typeof sessionResponse.data.sessionId === 'string' &&
                // 确保 sessionId 是字符串
                sessionResponse.data.sessionId.length > 0)) {
                  _context2.next = 40;
                  break;
                }
                _this2.sessionId = sessionResponse.data.sessionId;
                console.log('新会话创建成功，Session ID:', _this2.sessionId);

                // 新增：从响应中提取并保存第一个技能的信息
                if (sessionResponse.data.skills && sessionResponse.data.skills.length > 0) {
                  firstSkill = sessionResponse.data.skills[0];
                  _this2.activeSkill.id = firstSkill.id;
                  _this2.activeSkill.type = firstSkill.type;
                  console.log('已激活技能:', JSON.parse(JSON.stringify(_this2.activeSkill)));
                } else {
                  console.warn('newsession响应中未找到可用技能(skills)，后续调用可能受影响。');
                }
                uni.setNavigationBarTitle({
                  title: "\u4E0E ".concat(_this2.selectedAssistant.name, " \u5BF9\u8BDD\u4E2D")
                });
                _context2.next = 44;
                break;
              case 40:
                console.error('创建会话失败或未返回有效的sessionId (检查后):', sessionResponse);
                // 抛出更具体的错误信息，如果可能的话
                errMsg = '创建会话失败或未返回有效的sessionId';
                if (sessionResponse && sessionResponse.data && typeof sessionResponse.data.sessionId === 'string' && sessionResponse.data.sessionId.length === 0) {
                  errMsg = '创建会话成功，但返回的sessionId为空字符串';
                } else if (sessionResponse && sessionResponse.data && typeof sessionResponse.data.sessionId !== 'string') {
                  errMsg = "\u521B\u5EFA\u4F1A\u8BDD\u6210\u529F\uFF0C\u4F46sessionId\u7C7B\u578B\u4E0D\u6B63\u786E (\u9884\u671Fstring\uFF0C\u5B9E\u9645".concat((0, _typeof2.default)(sessionResponse.data.sessionId), ")");
                } else if (sessionResponse && !sessionResponse.status) {
                  errMsg = "\u521B\u5EFA\u4F1A\u8BDDAPI\u54CD\u5E94\u72B6\u6001\u975E\u6210\u529F (status: ".concat(sessionResponse.status, ")");
                }
                throw new Error((sessionResponse === null || sessionResponse === void 0 ? void 0 : sessionResponse.message) || errMsg);
              case 44:
                _context2.next = 48;
                break;
              case 46:
                console.warn('未获取到助手列表，或列表为空');
                _this2.chatMessages.unshift({
                  type: 'system',
                  content: '抱歉，助手列表为空，无法初始化会话。'
                });
              case 48:
                uni.hideLoading();
                console.log('初始化完成');
                _context2.next = 58;
                break;
              case 52:
                _context2.prev = 52;
                _context2.t0 = _context2["catch"](1);
                uni.hideLoading();
                console.error('初始化AI助手失败:', {
                  error: _context2.t0.message,
                  stack: _context2.t0.stack,
                  response: _context2.t0.response
                });

                // 使用默认欢迎消息
                _this2.chatMessages = [{
                  type: 'system',
                  content: '抱歉，AI助手连接失败，请稍后重试。'
                }];
                throw _context2.t0;
              case 58:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[1, 52]]);
      }))();
    },
    // 发送消息
    sendMessage: function sendMessage() {
      var _this3 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        var userMessage, messageToSend, response, thinkingBlock, lastMessageIndex;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (_this3.inputMessage.trim()) {
                  _context3.next = 3;
                  break;
                }
                uni.showToast({
                  title: '不能发送空消息',
                  icon: 'none'
                });
                return _context3.abrupt("return");
              case 3:
                if (_this3.sessionId) {
                  _context3.next = 7;
                  break;
                }
                uni.showToast({
                  title: '会话未建立，请稍后重试',
                  icon: 'none'
                });
                console.error('sendMessage 失败: sessionId 为空');
                return _context3.abrupt("return");
              case 7:
                userMessage = {
                  id: "user-".concat(Date.now()),
                  // 为用户消息添加唯一ID
                  type: 'user',
                  content: _this3.inputMessage.trim(),
                  timestamp: Date.now()
                };
                _this3.chatMessages.push(userMessage);
                _this3.scrollToBottom();
                messageToSend = _this3.inputMessage;
                _this3.inputMessage = ''; // 立刻清空输入框
                _context3.prev = 12;
                console.log("\u51C6\u5907\u53D1\u9001\u6D88\u606F: \"".concat(messageToSend, "\" \u5230 sessionId: ").concat(_this3.sessionId));
                // uni.showLoading({ title: '正在发送...' });
                _context3.next = 16;
                return _kingdeeAgent.default.sendChatMessage({
                  sessionId: _this3.sessionId,
                  userInput: messageToSend,
                  skillInfo: _this3.activeSkill
                });
              case 16:
                response = _context3.sent;
                // uni.hideLoading();
                console.log('消息发送成功，API响应:', response);

                // 提前创建思考面板
                if (response && response.runId) {
                  thinkingBlock = {
                    id: response.runId,
                    type: 'thinking_process',
                    status: 'in_progress',
                    title: '校园助手正在执行中...',
                    steps: [],
                    timestamp: Date.now()
                  };
                  _this3.chatMessages.push(thinkingBlock);
                  _this3.scrollToBottom();
                }

                // 记录返回的taskId，可能用于后续操作，如停止任务
                if (response && response.taskId) {
                  _this3.currentTaskId = response.taskId;
                  console.log('记录当前任务ID:', _this3.currentTaskId);
                }
                _context3.next = 28;
                break;
              case 22:
                _context3.prev = 22;
                _context3.t0 = _context3["catch"](12);
                // uni.hideLoading();
                console.error('发送消息失败:', _context3.t0);
                _this3.addSystemMessage("\u6D88\u606F\u53D1\u9001\u5931\u8D25: ".concat(_context3.t0.message || '网络错误'));
                // 可选：将发送失败的消息状态更新
                lastMessageIndex = _this3.chatMessages.length - 1;
                if (_this3.chatMessages[lastMessageIndex] === userMessage) {
                  _this3.$set(_this3.chatMessages, lastMessageIndex, _objectSpread(_objectSpread({}, userMessage), {}, {
                    error: true,
                    content: userMessage.content + ' (发送失败)'
                  }));
                }
              case 28:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[12, 22]]);
      }))();
    },
    addSystemMessage: function addSystemMessage(content) {
      this.chatMessages.push({
        type: 'system',
        content: content,
        timestamp: Date.now()
      });
      this.scrollToBottom();
    },
    // 滚动到底部
    scrollToBottom: function scrollToBottom() {
      var _this4 = this;
      this.$nextTick(function () {
        var lastMessageIndex = _this4.chatMessages.length - 1;
        if (lastMessageIndex < 0) return;
        // 这里使用一个较大的值来确保滚动到底部
        _this4.scrollTop = _this4.scrollTop + 9999;
      });
    },
    // 语音输入
    startVoiceInput: function startVoiceInput() {
      uni.showToast({
        title: '语音功能开发中...',
        icon: 'none'
      });
    },
    // 附件菜单
    showAttachMenu: function showAttachMenu() {
      uni.showToast({
        title: '附件功能开发中...',
        icon: 'none'
      });
    },
    // 快捷指令处理
    handleQuickAccess: function handleQuickAccess(item) {
      if (item.path) {
        uni.navigateTo({
          url: item.path
        });
      } else {
        uni.showToast({
          title: '功能开发中...',
          icon: 'none'
        });
      }
    },
    // 查看任务详情
    viewTaskDetail: function viewTaskDetail(task) {
      uni.showToast({
        title: '任务详情功能开发中...',
        icon: 'none'
      });
    },
    // 加载更多历史消息
    loadMoreMessages: function loadMoreMessages() {
      uni.showToast({
        title: '没有更多历史消息了',
        icon: 'none'
      });
    },
    // 以下是处理从Webhook接收到的消息的逻辑
    // 注意：这部分逻辑现在需要一个服务器来接收Webhook并将其推送到小程序
    handleWebhookData: function handleWebhookData(payload) {
      var _this5 = this;
      console.log("处理Webhook数据:", payload);
      if (!payload || !payload.message) {
        console.warn("收到的Webhook数据格式不正确", payload);
        return;
      }
      var message = payload.message,
        sessionId = payload.sessionId,
        taskId = payload.taskId;
      this.currentTaskId = taskId;
      if (message.actionList && Array.isArray(message.actionList)) {
        message.actionList.forEach(function (action) {
          return _this5.handleAction(action);
        });
      }
    },
    handleAction: function handleAction(action) {
      console.log("处理Action:", action);
      switch (action.type) {
        case 'waiting':
          this.handleWaitingAction(action);
          break;
        case 'chat':
          this.handleChatAction(action);
          break;
        case 'task':
          this.handleTaskAction(action);
          break;
        case 'error':
          this.handleErrorAction(action);
          break;
        case 'runStepChat':
          // 新增: 处理思考步骤
          this.handleRunStepAction(action);
          break;
        default:
          console.warn("未知的Action类型:", action.type);
      }
    },
    handleWaitingAction: function handleWaitingAction(action) {
      if (action.waitState === 'start') {
        this.isAssistantTyping = true;
        this.addOrUpdateBotMessage("...", "typing_indicator");
      } else {
        // end
        this.isAssistantTyping = false;
        this.removeBotMessage("typing_indicator");
      }
    },
    handleErrorAction: function handleErrorAction(action) {
      var _action$data;
      console.error("收到来自AI助手的错误:", action.data);
      var errorMessage = ((_action$data = action.data) === null || _action$data === void 0 ? void 0 : _action$data.desc) || "助手返回了一个未知错误";
      this.addSystemMessage("\u62B1\u6B49\uFF0C\u51FA\u9519\u4E86: ".concat(errorMessage));
    },
    handleChatAction: function handleChatAction(action) {
      this.isAssistantTyping = false;
      this.removeBotMessage("typing_indicator");

      // 如果这个chat消息关联着一个思考过程，那么就将该过程标记为完成
      if (action.data && action.data.runId) {
        var thinkingBlockIndex = this.chatMessages.findIndex(function (m) {
          return m.id === action.data.runId && m.type === 'thinking_process';
        });
        if (thinkingBlockIndex > -1) {
          // 使用 $set 保证响应式更新
          this.$set(this.chatMessages[thinkingBlockIndex], 'status', 'completed');
          this.$set(this.chatMessages[thinkingBlockIndex], 'title', '执行完成');
        }
      }

      // 根据用户提供的正确日志结构，从 action.data.message 获取文本
      // 并使用 action.data.taskId 作为唯一标识符来合并流式消息
      if (action.data && action.data.message) {
        // 使用一个唯一的ID来聚合最终的聊天消息，以避免与使用相同runId/taskId的"思考过程"面板冲突
        var finalMessageId = "final-message-".concat(action.data.runId || action.data.taskId);
        this.addOrUpdateBotMessage(action.data.message, finalMessageId);
      } else {
        console.error("收到的chat action格式不正确，缺少 data.message:", action);
      }
    },
    handleRunStepAction: function handleRunStepAction(action) {
      var _action$data2 = action.data,
        runId = _action$data2.runId,
        runStepId = _action$data2.runStepId,
        stepTypeName = _action$data2.stepTypeName,
        message = _action$data2.message,
        stepStatus = _action$data2.stepStatus,
        type = _action$data2.type;
      if (!runId || !runStepId) return;

      // 寻找或创建主思考面板
      var thinkingBlock = this.chatMessages.find(function (m) {
        return m.id === runId && m.type === 'thinking_process';
      });
      if (!thinkingBlock) {
        thinkingBlock = {
          id: runId,
          type: 'thinking_process',
          status: 'in_progress',
          title: '校园助手正在执行中...',
          steps: [],
          timestamp: Date.now(),
          isThinkingVisible: true // 默认展开
        };

        this.chatMessages.push(thinkingBlock);
      } else {
        // 如果已存在，确保它是可见的
        this.$set(thinkingBlock, 'isThinkingVisible', true);
      }

      // 寻找或创建步骤
      var step = thinkingBlock.steps.find(function (s) {
        return s.id === runStepId;
      });
      if (!step) {
        step = {
          id: runStepId,
          type: type,
          // 保存步骤类型，如 'tool' 或 'llm'
          title: stepTypeName || this.getStepTitle(action.data),
          // 使用一个辅助函数获取标题
          displayContent: '',
          isJson: false,
          isExpanded: false // 默认不展开步骤详情
        };

        var content = message;
        try {
          var parsed = JSON.parse(content);
          step.displayContent = JSON.stringify(parsed, null, 2);
          step.isJson = true;
        } catch (e) {
          step.displayContent = content;
          step.isJson = false;
        }
        thinkingBlock.steps.push(step);
      }
      // 无论如何都强制UI更新，以防万一
      this.$forceUpdate();
      this.scrollToBottom();
    },
    toggleThinkingVisibility: function toggleThinkingVisibility(messageIndex) {
      var msg = this.chatMessages[messageIndex];
      if (msg) {
        this.$set(msg, 'isThinkingVisible', !msg.isThinkingVisible);
      }
    },
    toggleStep: function toggleStep(messageIndex, stepIndex) {
      var msg = this.chatMessages[messageIndex];
      if (msg && msg.steps && msg.steps[stepIndex]) {
        var step = msg.steps[stepIndex];
        this.$set(step, 'isExpanded', !step.isExpanded);
      }
    },
    getStepTitle: function getStepTitle(runStep) {
      // 根据runStep的类型和内容生成更友好的标题
      // (这是一个示例，您可以根据实际的stepTypeName和message内容进行扩展)
      if (runStep.stepTypeName && runStep.stepTypeName.includes('llm-chat')) {
        return '正在思考...';
      }
      if (runStep.stepTypeName && runStep.stepTypeName.includes('tool-input')) {
        try {
          var toolCall = JSON.parse(runStep.message);
          return "\u51C6\u5907\u8C03\u7528\u5DE5\u5177: ".concat(toolCall.tool_name || '未知工具');
        } catch (e) {
          return '准备调用工具';
        }
      }
      if (runStep.stepTypeName && runStep.stepTypeName.includes('tool-output')) {
        return '获取到工具返回结果';
      }
      return runStep.stepTypeName || '未知步骤';
    },
    getStepIcon: function getStepIcon(type) {
      switch (type) {
        case 'llm':
          return '/static/images/assistant.png';
        // 假设这是LLM思考的图标
        case 'tool':
          return '/static/images/settings.png';
        // 假设这是工具调用的图标
        default:
          return '/static/images/ac.png';
        // 默认图标
      }
    },
    handleTaskAction: function handleTaskAction(action) {
      var taskData = action.task;
      var existingTaskIndex = this.ongoingTasks.findIndex(function (t) {
        return t.id === taskData.taskId;
      });
      var formattedTask = {
        id: taskData.taskId,
        title: taskData.taskTitle,
        description: taskData.taskDesc,
        progress: parseInt(taskData.progress, 10),
        status: taskData.status,
        // running, success, fail
        statusText: this.getTaskStatusText(taskData.status),
        remainingTime: "计算中...",
        // 需要逻辑来计算
        icon: this.getTaskIcon(taskData.taskTitle)
      };
      if (existingTaskIndex > -1) {
        this.$set(this.ongoingTasks, existingTaskIndex, formattedTask);
      } else {
        this.ongoingTasks.push(formattedTask);
      }
    },
    getTaskStatusText: function getTaskStatusText(status) {
      var map = {
        running: "进行中",
        success: "已完成",
        fail: "已失败"
      };
      return map[status] || "未知";
    },
    getTaskIcon: function getTaskIcon(title) {
      if (title.includes("课表")) return "/static/images/schedule.png";
      if (title.includes("订餐")) return "/static/images/food.png";
      return "/static/images/task.png"; // 默认图标
    },
    addOrUpdateBotMessage: function addOrUpdateBotMessage(content, messageId) {
      var existingMsgIndex = this.chatMessages.findIndex(function (m) {
        return m.id === messageId;
      });
      if (existingMsgIndex > -1) {
        // 更新现有消息
        var msg = this.chatMessages[existingMsgIndex];
        this.$set(this.chatMessages[existingMsgIndex], 'content', msg.content + content);
      } else {
        // 添加新消息
        this.chatMessages.push({
          id: messageId,
          type: 'system',
          content: content,
          timestamp: Date.now()
        });
      }
      this.scrollToBottom();
    },
    removeBotMessage: function removeBotMessage(messageId) {
      var msgIndex = this.chatMessages.findIndex(function (m) {
        return m.id === messageId;
      });
      if (msgIndex > -1) {
        this.chatMessages.splice(msgIndex, 1);
      }
    },
    // --- WebSocket相关方法 ---
    connectWebSocket: function connectWebSocket() {
      var _this6 = this;
      // 从 "https://xxx.com" 生成 "wss://xxx.com"
      var wsUrl = this.tunnelUrl.replace(/^http/, 'ws');
      console.log("\u5C1D\u8BD5\u8FDE\u63A5WebSocket: ".concat(wsUrl));
      this.websocketTask = uni.connectSocket({
        url: wsUrl,
        success: function success() {
          console.log("uni.connectSocket 调用成功");
        },
        fail: function fail(err) {
          console.error("uni.connectSocket 调用失败", err);
        }
      });
      this.websocketTask.onOpen(function () {
        console.log('✅ WebSocket 连接已打开');
        _this6.websocketConnected = true;
        // 清除可能存在的重连定时器
        if (_this6.reconnectInterval) {
          clearInterval(_this6.reconnectInterval);
          _this6.reconnectInterval = null;
        }
        _this6.addSystemMessage("智能助手连接成功！");

        // 新增：开启心跳
        _this6.startHeartbeat();
      });
      this.websocketTask.onMessage(function (res) {
        console.log('收到WebSocket消息:', res.data);

        // 新增：处理心跳回声，避免JSON解析错误
        if (typeof res.data === 'string' && res.data.startsWith('Echo:')) {
          console.log('❤️ 心跳响应 (Pong) 已收到。');
          return; // 是心跳回声，直接忽略，不进行解析
        }

        try {
          var payload = JSON.parse(res.data);
          // 调用我们已经写好的Webhook处理逻辑
          _this6.handleWebhookData(payload);
        } catch (e) {
          console.error('解析WebSocket消息失败:', e);
        }
      });
      this.websocketTask.onError(function (err) {
        console.error('WebSocket 连接发生错误:', err);
        _this6.websocketConnected = false;
        _this6.addSystemMessage("与助手的连接发生错误，请检查网络。");
      });
      this.websocketTask.onClose(function (res) {
        console.log('🔌 WebSocket 连接已关闭', res);
        _this6.websocketConnected = false;

        // 新增：停止心跳
        _this6.stopHeartbeat();
        if (_this6.reconnectInterval) return; // 防止重复设置

        _this6.addSystemMessage("与助手连接已断开，尝试重新连接...");
        _this6.reconnectInterval = setInterval(function () {
          console.log("尝试重新连接WebSocket...");
          _this6.connectWebSocket();
        }, 5000); // 每5秒重连一次
      });
    },
    // --- 新增：心跳相关方法 ---
    startHeartbeat: function startHeartbeat() {
      var _this7 = this;
      // 先清除旧的，以防万一
      this.stopHeartbeat();
      console.log('❤️ 启动WebSocket心跳...');
      this.heartbeatInterval = setInterval(function () {
        if (_this7.websocketConnected) {
          var pingMessage = JSON.stringify({
            type: 'ping'
          });
          _this7.websocketTask.send({
            data: pingMessage,
            success: function success() {
              console.log('❤️ 心跳发送: ping');
            },
            fail: function fail(err) {
              console.error('💔 心跳发送失败:', err);
            }
          });
        }
      }, 30000); // 每30秒发送一次
    },
    stopHeartbeat: function stopHeartbeat() {
      if (this.heartbeatInterval) {
        console.log('💔 停止WebSocket心跳...');
        clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = null;
      }
    }
  },
  onUnload: function onUnload() {
    // 页面卸载时关闭WebSocket连接
    if (this.websocketTask) {
      this.websocketTask.close({
        code: 1000,
        reason: '页面关闭'
      });
    }
    // 清除重连定时器
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
      this.reconnectInterval = null;
    }
    // 新增：清除心跳定时器
    this.stopHeartbeat();
  }
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ }),

/***/ 45:
/*!**********************************************************************************************************!*\
  !*** D:/软件杯/校园智能体小程序/pages/assistant/index.vue?vue&type=style&index=0&id=411d5278&scoped=true&lang=css& ***!
  \**********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_id_411d5278_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--6-oneOf-1-3!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./index.vue?vue&type=style&index=0&id=411d5278&scoped=true&lang=css& */ 46);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_id_411d5278_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_id_411d5278_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_id_411d5278_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_id_411d5278_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_id_411d5278_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 46:
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!./node_modules/postcss-loader/src??ref--6-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/软件杯/校园智能体小程序/pages/assistant/index.vue?vue&type=style&index=0&id=411d5278&scoped=true&lang=css& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[34,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/assistant/index.js.map