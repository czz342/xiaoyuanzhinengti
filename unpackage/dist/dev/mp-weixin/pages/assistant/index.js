(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/assistant/index"],{

/***/ 34:
/*!*******************************************************************************************************!*\
  !*** D:/netease-codewave-competition/campus-life-system/main.js?{"page":"pages%2Fassistant%2Findex"} ***!
  \*******************************************************************************************************/
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
/*!************************************************************************************!*\
  !*** D:/netease-codewave-competition/campus-life-system/pages/assistant/index.vue ***!
  \************************************************************************************/
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
/*!*******************************************************************************************************************************!*\
  !*** D:/netease-codewave-competition/campus-life-system/pages/assistant/index.vue?vue&type=template&id=411d5278&scoped=true& ***!
  \*******************************************************************************************************************************/
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
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/netease-codewave-competition/campus-life-system/pages/assistant/index.vue?vue&type=template&id=411d5278&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
  var l2 = _vm.__map(_vm.chatMessages, function (msg, index) {
    var $orig = _vm.__get_orig(msg)
    var l0 =
      (msg.type === "user" || msg.type === "system") && !msg.error
        ? _vm.parseMessage(msg.content)
        : null
    var l1 =
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
      l1: l1,
    }
  })
  var g0 = _vm.ongoingTasks.length
  if (!_vm._isMounted) {
    _vm.e0 = function ($event, part) {
      var _temp = arguments[arguments.length - 1].currentTarget.dataset,
        _temp2 = _temp.eventParams || _temp["event-params"],
        part = _temp2.part
      var _temp, _temp2
      return _vm.handleLinkClick(part.path)
    }
  }
  _vm.$mp.data = Object.assign(
    {},
    {
      $root: {
        l2: l2,
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
/*!*************************************************************************************************************!*\
  !*** D:/netease-codewave-competition/campus-life-system/pages/assistant/index.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************/
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
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/netease-codewave-competition/campus-life-system/pages/assistant/index.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
var _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ 13));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ 42));
var _kingdeeAgent = _interopRequireDefault(__webpack_require__(/*! @/services/kingdeeAgent */ 43));
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
      // !!!重要!!!: 每次启动cloudflared后，请在这里更新为新的公网地址
      tunnelUrl: "https://winners-execute-existence-lower.trycloudflare.com",
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
                  _context2.next = 45;
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
                /* this.chatMessages.unshift({
                	type: 'system',
                	content: this.selectedAssistant.openingSpeech || `您好，我是您的助手 ${this.selectedAssistant.name}，有什么可以帮助您的吗？`,
                	timestamp: Date.now()
                }); */

                uni.showLoading({
                  title: '正在创建新会话...'
                });

                // 从选中的助手中获取 assistantId
                assistantIdToUse = _this2.selectedAssistant.id; // 将回调URL指向我们的cloudflared服务器
                callbackUrlToUse = "".concat(_this2.tunnelUrl, "/webhook");
                if (assistantIdToUse) {
                  _context2.next = 25;
                  break;
                }
                console.error("无法从selectedAssistant中获取有效的ID!");
                throw new Error("无法初始化会话：助手ID缺失。");
              case 25:
                console.log("\u51C6\u5907\u8C03\u7528createSession\uFF0CassistantId: ".concat(assistantIdToUse, ", callbackUrl: ").concat(callbackUrlToUse));
                _context2.next = 28;
                return _kingdeeAgent.default.createSession(assistantIdToUse, callbackUrlToUse);
              case 28:
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
                  _context2.next = 39;
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
                _context2.next = 43;
                break;
              case 39:
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
              case 43:
                _context2.next = 47;
                break;
              case 45:
                console.warn('未获取到助手列表，或列表为空');
                _this2.chatMessages.unshift({
                  type: 'system',
                  content: '抱歉，助手列表为空，无法初始化会话。'
                });
              case 47:
                uni.hideLoading();
                console.log('初始化完成');
                _context2.next = 57;
                break;
              case 51:
                _context2.prev = 51;
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
              case 57:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[1, 51]]);
      }))();
    },
    // 发送消息
    sendMessage: function sendMessage() {
      var _this3 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        var messageToSend, userMessage, response, thinkingProcessPlaceholder, placeholder;
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
                // 核心修正：先将输入内容存入局部变量
                messageToSend = _this3.inputMessage; // Add user message to chat list
                userMessage = {
                  id: "user-".concat(Date.now()),
                  type: 'user',
                  content: messageToSend,
                  timestamp: Date.now()
                };
                _this3.chatMessages.push(userMessage);

                // 然后再清空输入框
                _this3.inputMessage = '';
                _this3.scrollToBottom();
                _context3.prev = 8;
                _context3.next = 11;
                return _kingdeeAgent.default.sendChatMessage({
                  sessionId: _this3.sessionId,
                  // 使用存好的局部变量发送
                  userInput: messageToSend
                });
              case 11:
                response = _context3.sent;
                console.log('消息发送成功，API响应:', response);
                thinkingProcessPlaceholder = {
                  id: "thinking-".concat(Date.now()),
                  type: 'thinking_process',
                  runId: null,
                  title: 'AI思考中...',
                  status: 'in_progress',
                  isThinkingVisible: true,
                  steps: []
                };
                _this3.chatMessages.push(thinkingProcessPlaceholder);
                _this3.scrollToBottom();
                if (response && response.runId) {
                  console.log('API同步响应中包含runId，立即更新占位符');
                  placeholder = _this3.chatMessages.find(function (msg) {
                    return msg.id === thinkingProcessPlaceholder.id;
                  });
                  if (placeholder) {
                    _this3.$set(placeholder, 'runId', response.runId);
                  }
                }
                _context3.next = 22;
                break;
              case 19:
                _context3.prev = 19;
                _context3.t0 = _context3["catch"](8);
                // 用户指出，由于环境性能问题，超时是可预期的，
                // 且不影响后续WebSocket消息的接收，因此不再将此错误显示在UI上。
                // 我们仅在控制台记录此错误以供调试。
                console.warn("\u53D1\u9001\u6D88\u606F\u65F6\u53D1\u751F\u53EF\u9884\u671F\u7684\u9519\u8BEF\uFF08\u901A\u5E38\u662F\u8D85\u65F6\uFF09: ".concat(_context3.t0.message));

                /*
                const errorId = `error-${Date.now()}`;
                this.chatMessages.push({
                	id: errorId,
                	type: 'system',
                	content: `发送失败: ${error.message}`,
                	error: true,
                	timestamp: Date.now()
                });
                this.scrollToBottom();
                */
              case 22:
                _context3.prev = 22;
                return _context3.finish(22);
              case 24:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[8, 19, 22, 24]]);
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
      console.log('处理Action:', action);
      var runId = action.data ? action.data.runId : null;
      switch (action.type) {
        case 'identifySkill':
        case 'streamDone':
          // 识别到中控发来的新事件类型，暂不处理，仅消除报错
          console.log("\u5DF2\u8BC6\u522B\u5E76\u5FFD\u7565Action\u7C7B\u578B: ".concat(action.type));
          break;
        case 'runStepChat':
          {
            // 使用块级作用域
            if (!runId) {
              console.warn('runStepChat消息中没有runId，无法处理:', action);
              return;
            }

            // 核心逻辑：寻找正确的思考面板
            // 1. 先尝试通过runId寻找已关联的面板
            var thinkingProcess = this.chatMessages.find(function (msg) {
              return msg.runId === runId;
            });

            // 2. 如果没找到，说明这是第一个携带runId的消息，需要认领占位符面板
            if (!thinkingProcess) {
              thinkingProcess = this.chatMessages.find(function (msg) {
                return msg.type === 'thinking_process' && !msg.runId;
              });
              if (thinkingProcess) {
                console.log("\u4E3A\u601D\u8003\u9762\u677F\u5360\u4F4D\u7B26\u5173\u8054\u4E0ArunId: ".concat(runId));
                // 使用$set确保响应性
                this.$set(thinkingProcess, 'runId', runId);
              }
            }

            // 3. 如果仍然没有找到（异常情况），则创建一个新的
            if (!thinkingProcess) {
              console.warn("\u672A\u627E\u5230\u4E0ErunId ".concat(runId, " \u5339\u914D\u7684\u601D\u8003\u8FC7\u7A0B\uFF0C\u5C06\u521B\u5EFA\u4E00\u4E2A\u65B0\u7684\u3002"));
              thinkingProcess = {
                id: "thinking-".concat(runId),
                type: 'thinking_process',
                runId: runId,
                title: 'AI思考中...',
                status: 'in_progress',
                isThinkingVisible: true,
                steps: []
              };
              this.chatMessages.push(thinkingProcess);
            }

            // 更新思考过程的状态
            if (thinkingProcess.status !== 'completed') {
              thinkingProcess.status = 'in_progress';
            }
            var stepData = action.data;
            var stepIndex = thinkingProcess.steps.findIndex(function (s) {
              return s.id === stepData.runStepId;
            });
            var displayContent = this.formatStepContent(stepData.message);
            var newStep = {
              id: stepData.runStepId,
              title: stepData.stepTypeName,
              type: stepData.stepType,
              status: stepData.stepStatus,
              content: stepData.message,
              displayContent: displayContent.content,
              isJson: displayContent.isJson,
              isExpanded: false // 默认折叠新步骤
            };

            if (stepIndex > -1) {
              // 更新现有步骤
              this.$set(thinkingProcess.steps, stepIndex, newStep);
            } else {
              // 添加新步骤
              thinkingProcess.steps.push(newStep);
            }
            this.$forceUpdate(); // 强制视图更新
            this.scrollToBottom();
          }
          break;
        case 'chat':
          {
            // 使用块级作用域
            if (!runId) {
              console.warn('Chat消息中没有runId，无法处理:', action);
              return;
            }

            // 定位到对应的思考过程
            // 1. 先尝试通过runId寻找已关联的面板
            var _thinkingProcess = this.chatMessages.find(function (msg) {
              return msg.runId === runId;
            });

            // 2. 如果没找到，认领占位符面板 (处理AI直接回答的场景)
            if (!_thinkingProcess) {
              _thinkingProcess = this.chatMessages.find(function (msg) {
                return msg.type === 'thinking_process' && !msg.runId;
              });
              if (_thinkingProcess) {
                console.log("Chat\u6D88\u606F\u62B5\u8FBE\uFF0C\u4E3A\u601D\u8003\u9762\u677F\u5360\u4F4D\u7B26\u5173\u8054\u4E0ArunId: ".concat(runId));
                this.$set(_thinkingProcess, 'runId', runId);
              }
            }
            if (_thinkingProcess) {
              // 当最终chat消息到达时，标记思考过程为完成
              _thinkingProcess.status = 'completed';
              _thinkingProcess.title = 'AI思考完成';
            }
            var messageData = action.data;
            var messageId = "final-message-".concat(runId); // 使用runId确保唯一性

            var finalMessage = this.chatMessages.find(function (msg) {
              return msg.id === messageId;
            });
            if (finalMessage) {
              // 追加内容
              finalMessage.content += messageData.message;
            } else {
              // 创建新消息
              finalMessage = {
                id: messageId,
                type: 'system',
                content: messageData.message,
                runId: runId,
                // 关联runId
                timestamp: Date.now()
              };
              this.chatMessages.push(finalMessage);
            }
            this.scrollToBottom();
            this.$forceUpdate(); // 确保视图更新
          }

          break;
        case 'waiting':
          // 等待状态，可以用来显示一个通用的"处理中"状态，但我们已有思考面板，故忽略
          console.log('收到waiting状态，暂不处理。');
          break;
        default:
          console.error('未知的Action类型:', action.type);
      }
    },
    formatStepContent: function formatStepContent(content) {
      try {
        // 尝试解析为JSON
        var parsed = JSON.parse(content);
        // 如果成功，格式化为带缩进的字符串
        return {
          content: JSON.stringify(parsed, null, 2),
          isJson: true
        };
      } catch (e) {
        // 如果解析失败，说明是普通文本
        return {
          content: content,
          isJson: false
        };
      }
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
    getStepIcon: function getStepIcon(stepType) {
      var icons = {
        'llm': '/static/images/assistant.png',
        'tool': '/static/images/settings.png',
        'ac': '/static/images/ac.png'
      };
      return icons[stepType] || '/static/images/ac.png';
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
        // this.addSystemMessage("智能助手连接成功！");

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
    },
    parseMessage: function parseMessage(content) {
      // 正则表达式，用于匹配 Markdown 链接 [文字](路径) 或裸露的 /pages/ 路径
      var regex = /\[([^\]]+)\]\(([^)]+)\)|(\/pages\/[\w\/?=&.-]+)/g;
      var parts = [];
      var lastIndex = 0;
      var match;
      while ((match = regex.exec(content)) !== null) {
        // 添加链接前的文本部分
        if (match.index > lastIndex) {
          parts.push({
            type: 'text',
            content: content.substring(lastIndex, match.index)
          });
        }

        // 判断匹配到的是哪种链接
        if (match[1] && match[2]) {
          // 匹配到 Markdown 链接
          parts.push({
            type: 'link',
            text: match[1],
            path: match[2]
          });
        } else if (match[3]) {
          // 匹配到裸露路径
          parts.push({
            type: 'link',
            text: '点击查看详情',
            path: match[3]
          }); // 使用默认文本
        }

        lastIndex = regex.lastIndex;
      }

      // 添加最后一个链接后的文本部分
      if (lastIndex < content.length) {
        parts.push({
          type: 'text',
          content: content.substring(lastIndex)
        });
      }

      // 如果没有找到任何链接，则返回包含整个内容的单个文本部分
      return parts.length > 0 ? parts : [{
        type: 'text',
        content: content
      }];
    },
    handleLinkClick: function handleLinkClick(path) {
      if (!path || !path.startsWith('/pages/')) {
        console.error('无效或不安全的页面路径:', path);
        uni.showToast({
          title: '无法跳转到该页面',
          icon: 'none'
        });
        return;
      }
      uni.navigateTo({
        url: path,
        fail: function fail(err) {
          console.error('跳转失败:', err);
          uni.showToast({
            title: '页面跳转失败',
            icon: 'none'
          });
        }
      });
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
/*!*********************************************************************************************************************************************!*\
  !*** D:/netease-codewave-competition/campus-life-system/pages/assistant/index.vue?vue&type=style&index=0&id=411d5278&scoped=true&lang=css& ***!
  \*********************************************************************************************************************************************/
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
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!./node_modules/postcss-loader/src??ref--6-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/netease-codewave-competition/campus-life-system/pages/assistant/index.vue?vue&type=style&index=0&id=411d5278&scoped=true&lang=css& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[34,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/assistant/index.js.map