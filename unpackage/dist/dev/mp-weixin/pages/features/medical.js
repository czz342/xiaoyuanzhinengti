(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/features/medical"],{

/***/ 159:
/*!*********************************************************************!*\
  !*** D:/软件杯/校园智能体小程序/main.js?{"page":"pages%2Ffeatures%2Fmedical"} ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, createPage) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
__webpack_require__(/*! uni-pages */ 26);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
var _medical = _interopRequireDefault(__webpack_require__(/*! ./pages/features/medical.vue */ 160));
// @ts-ignore
wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;
createPage(_medical.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["createPage"]))

/***/ }),

/***/ 160:
/*!**************************************************!*\
  !*** D:/软件杯/校园智能体小程序/pages/features/medical.vue ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _medical_vue_vue_type_template_id_2f959890___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./medical.vue?vue&type=template&id=2f959890& */ 161);
/* harmony import */ var _medical_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./medical.vue?vue&type=script&lang=js& */ 163);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _medical_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _medical_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _medical_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./medical.vue?vue&type=style&index=0&lang=css& */ 165);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 32);

var renderjs





/* normalize component */

var component = Object(_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _medical_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _medical_vue_vue_type_template_id_2f959890___WEBPACK_IMPORTED_MODULE_0__["render"],
  _medical_vue_vue_type_template_id_2f959890___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null,
  false,
  _medical_vue_vue_type_template_id_2f959890___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "pages/features/medical.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 161:
/*!*********************************************************************************!*\
  !*** D:/软件杯/校园智能体小程序/pages/features/medical.vue?vue&type=template&id=2f959890& ***!
  \*********************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_medical_vue_vue_type_template_id_2f959890___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./medical.vue?vue&type=template&id=2f959890& */ 162);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_medical_vue_vue_type_template_id_2f959890___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_medical_vue_vue_type_template_id_2f959890___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_medical_vue_vue_type_template_id_2f959890___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_medical_vue_vue_type_template_id_2f959890___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 162:
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/软件杯/校园智能体小程序/pages/features/medical.vue?vue&type=template&id=2f959890& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
    uniLoadMore: function () {
      return Promise.all(/*! import() | uni_modules/uni-load-more/components/uni-load-more/uni-load-more */[__webpack_require__.e("common/vendor"), __webpack_require__.e("uni_modules/uni-load-more/components/uni-load-more/uni-load-more")]).then(__webpack_require__.bind(null, /*! @/uni_modules/uni-load-more/components/uni-load-more/uni-load-more.vue */ 304))
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
  var g0 =
    _vm.currentTab === 0 && _vm.selectedDate && !_vm.isLoadingDoctors
      ? _vm.doctorsList.length
      : null
  var g1 =
    _vm.currentTab === 1 && !_vm.isLoadingAppointments
      ? _vm.filteredAppointments.length
      : null
  var g2 =
    _vm.currentTab === 2 &&
    _vm.currentRecordType === 0 &&
    !_vm.isLoadingMedicalRecords
      ? _vm.medicalRecords.length
      : null
  var g3 =
    _vm.currentTab === 2 && _vm.currentRecordType === 1
      ? _vm.examReports.length
      : null
  var g4 =
    _vm.currentTab === 2 && _vm.currentRecordType === 2
      ? _vm.vaccineRecords.length
      : null
  var g5 =
    _vm.showDoctorDetailPopup && !_vm.currentDoctor.isLoadingSlots
      ? _vm.currentDoctor.availableSlots &&
        _vm.currentDoctor.availableSlots.length > 0
      : null
  var l0 =
    _vm.showDoctorDetailPopup && !_vm.currentDoctor.isLoadingSlots && g5
      ? _vm.__map(_vm.currentDoctor.availableSlots, function (slot, slotIndex) {
          var $orig = _vm.__get_orig(slot)
          var m0 = _vm.isSlotSelectedInPopup(slot)
          return {
            $orig: $orig,
            m0: m0,
          }
        })
      : null
  var g6 =
    _vm.showMedicalRecordDetail &&
    !_vm.isLoadingRecordDetail &&
    _vm.currentMedicalRecord.billno
      ? (_vm.currentMedicalRecord.lb77_fdate || "").split(" ")
      : null
  var g7 =
    _vm.showMedicalRecordDetail &&
    !_vm.isLoadingRecordDetail &&
    _vm.currentMedicalRecord.billno
      ? _vm.currentMedicalRecord.entryentity &&
        _vm.currentMedicalRecord.entryentity.length > 0
      : null
  _vm.$mp.data = Object.assign(
    {},
    {
      $root: {
        g0: g0,
        g1: g1,
        g2: g2,
        g3: g3,
        g4: g4,
        g5: g5,
        l0: l0,
        g6: g6,
        g7: g7,
      },
    }
  )
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 163:
/*!***************************************************************************!*\
  !*** D:/软件杯/校园智能体小程序/pages/features/medical.vue?vue&type=script&lang=js& ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_medical_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./medical.vue?vue&type=script&lang=js& */ 164);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_medical_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_medical_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_medical_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_medical_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_medical_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 164:
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/软件杯/校园智能体小程序/pages/features/medical.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ 42));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _kingdeeAgent = _interopRequireDefault(__webpack_require__(/*! @/services/kingdeeAgent.js */ 43));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
// 科室图标映射
var departmentIconMap = {
  '内科': '/static/images/dept-internal.png',
  '外科': '/static/images/dept-surgery.png',
  '口腔科': '/static/images/dept-dental.png',
  '眼科': '/static/images/dept-eye.png',
  '耳鼻喉科': '/static/images/dept-ent.png',
  '皮肤科': '/static/images/dept-derma.png',
  '心理咨询': '/static/images/dept-psychology.png',
  '中医科': '/static/images/dept-chinese.png'
};
// 医生默认头像列表
var doctorAvatars = ['/static/images/doctor1.png', '/static/images/doctor2.png', '/static/images/doctor3.png'];
var _default = {
  data: function data() {
    return {
      tabs: ['预约挂号', '我的预约', '健康档案'],
      currentTab: 0,
      departments: [],
      doctorsList: [],
      availableDates: [],
      selectedDepartment: null,
      selectedDate: null,
      // 弹窗相关
      showDoctorDetailPopup: false,
      currentDoctor: {},
      selectedTimeInPopup: null,
      isLoadingDepartments: true,
      isLoadingDoctors: false,
      appointmentStatusList: ['全部', '待就诊', '已完成', '已取消'],
      currentStatusTab: 0,
      myAppointments: [],
      isLoadingAppointments: true,
      currentUser: {
        studentId: '645730151',
        name: '张三'
      },
      healthRecordTypes: [{
        name: '就诊记录',
        icon: '/static/images/record-visit.png'
      }, {
        name: '体检报告',
        icon: '/static/images/record-exam.png'
      }, {
        name: '疫苗接种',
        icon: '/static/images/record-vaccine.png'
      }],
      currentRecordType: 0,
      medicalRecords: [],
      isLoadingMedicalRecords: false,
      examReports: [{
        id: 1,
        title: '2023学年入学体检',
        date: '2023-09-01',
        summary: '体检各项指标正常，无异常发现',
        location: '校医院体检中心',
        status: '正常'
      }],
      vaccineRecords: [{
        id: 1,
        name: '流感疫苗',
        status: '已接种',
        date: '2023-10-15',
        location: '校医院预防接种门诊',
        batch: 'FL202310A'
      }],
      showAppointmentSuccess: false,
      showAppointmentDetail: false,
      showMedicalRecordDetail: false,
      currentAppointment: {},
      currentMedicalRecord: {},
      isLoadingRecordDetail: false,
      appointmentResult: {}
    };
  },
  computed: {
    filteredAppointments: function filteredAppointments() {
      var _this = this;
      var appointmentsToFilter = this.myAppointments;
      if (this.currentStatusTab !== 0) {
        var statusMap = {
          1: '已预约',
          2: '已完成',
          3: '已取消'
        };
        var statusFilter = statusMap[this.currentStatusTab];
        appointmentsToFilter = this.myAppointments.filter(function (item) {
          return item.lb77_appointment_status === statusFilter;
        });
      }
      return appointmentsToFilter.map(function (appointment) {
        return _objectSpread(_objectSpread({}, appointment), {}, {
          department: appointment.lb77_doctor_lb77_department_name,
          doctorName: appointment.lb77_doctor_name,
          doctorTitle: appointment.lb77_doctor_lb77_title,
          date: appointment.lb77_appointment_date.split(' ')[0],
          time: _this.secondsToTime(appointment.lb77_starttime),
          location: '校医院 ' + appointment.lb77_doctor_lb77_department_name,
          status: appointment.lb77_appointment_status === '已预约' ? '待就诊' : appointment.lb77_appointment_status,
          statusClass: _this.getStatusClass(appointment.lb77_appointment_status)
        });
      });
    },
    currentAppointmentStatusClass: function currentAppointmentStatusClass() {
      if (this.currentAppointment && this.currentAppointment.status) {
        return this.getStatusClass(this.currentAppointment.status);
      }
      return '';
    }
  },
  onLoad: function onLoad(options) {
    var _this2 = this;
    return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
      var department, doctor;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this2.generateAvailableDates();
              _this2.fetchMyAppointments();
              _this2.fetchMedicalRecords();
              _this2.examReports = _this2.examReports.map(function (report) {
                return _objectSpread(_objectSpread({}, report), {}, {
                  statusClass: _this2.getReportStatusClass(report.status)
                });
              });
              _this2.vaccineRecords = _this2.vaccineRecords.map(function (vaccine) {
                return _objectSpread(_objectSpread({}, vaccine), {}, {
                  statusClass: _this2.getVaccineStatusClass(vaccine.status)
                });
              });

              // 默认加载，会选中第一个科室并加载其医生列表
              _context.next = 7;
              return _this2.fetchDepartments();
            case 7:
              if (!(options && options.departmentId && options.recommendDoctorId)) {
                _context.next = 19;
                break;
              }
              department = _this2.departments.find(function (d) {
                return d.number === options.departmentId;
              });
              if (!department) {
                _context.next = 17;
                break;
              }
              if (!(!_this2.selectedDepartment || _this2.selectedDepartment.number !== department.number)) {
                _context.next = 13;
                break;
              }
              _context.next = 13;
              return _this2.selectDepartment(department);
            case 13:
              // 现在正确的医生列表已加载，查找推荐的医生
              doctor = _this2.doctorsList.find(function (doc) {
                return doc.id === options.recommendDoctorId;
              });
              if (doctor) {
                _this2.$nextTick(function () {
                  _this2.showDoctorDetail(doctor);
                });
              } else {
                console.warn("\u5728\u79D1\u5BA4 ".concat(department.name, " \u672A\u627E\u5230ID\u4E3A ").concat(options.recommendDoctorId, " \u7684\u533B\u751F"));
                uni.showToast({
                  title: '未在该科室找到推荐医生',
                  icon: 'none'
                });
              }
              _context.next = 19;
              break;
            case 17:
              console.warn("\u672A\u627E\u5230ID\u4E3A ".concat(options.departmentId, " \u7684\u79D1\u5BA4"));
              uni.showToast({
                title: '未找到推荐的科室',
                icon: 'none'
              });
            case 19:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  methods: {
    // ===================================================================
    // ========================== 数据获取与处理 ==========================
    // ===================================================================
    generateAvailableDates: function generateAvailableDates() {
      var dates = [];
      var weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      for (var i = 0; i < 7; i++) {
        var date = new Date();
        date.setDate(date.getDate() + i);
        dates.push({
          fullDate: this.formatDate(date, 'yyyy-MM-dd'),
          day: this.formatDate(date, 'dd'),
          weekday: weekdays[date.getDay()]
        });
      }
      this.availableDates = dates;
      // 默认选中今天
      if (this.availableDates.length > 0) {
        this.selectDate(this.availableDates[0]);
      }
    },
    fetchDepartments: function fetchDepartments() {
      var _this3 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        var res;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _this3.isLoadingDepartments = true;
                _context2.prev = 1;
                _context2.next = 4;
                return _kingdeeAgent.default.getHospitalDepartments(20);
              case 4:
                res = _context2.sent;
                if (!(res && res.data && res.data.rows)) {
                  _context2.next = 10;
                  break;
                }
                _this3.departments = res.data.rows;
                // 默认选中第一个科室
                if (!(_this3.departments.length > 0)) {
                  _context2.next = 10;
                  break;
                }
                _context2.next = 10;
                return _this3.selectDepartment(_this3.departments[0]);
              case 10:
                _context2.next = 16;
                break;
              case 12:
                _context2.prev = 12;
                _context2.t0 = _context2["catch"](1);
                console.error("获取科室列表失败:", _context2.t0);
                uni.showToast({
                  title: '科室加载失败',
                  icon: 'none'
                });
              case 16:
                _context2.prev = 16;
                _this3.isLoadingDepartments = false;
                return _context2.finish(16);
              case 19:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[1, 12, 16, 19]]);
      }))();
    },
    fetchDoctors: function fetchDoctors(departmentNumber) {
      var _this4 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        var res;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _this4.isLoadingDoctors = true;
                _this4.doctorsList = [];
                _context3.prev = 2;
                _context3.next = 5;
                return _kingdeeAgent.default.getDoctorsByDepartment(departmentNumber);
              case 5:
                res = _context3.sent;
                if (res && res.data && res.data.rows) {
                  _this4.doctorsList = res.data.rows.map(function (doc, index) {
                    return _objectSpread(_objectSpread({}, doc), {}, {
                      id: doc.number,
                      avatar: doctorAvatars[index % doctorAvatars.length],
                      title: doc.lb77_title,
                      specialty: doc.lb77_specialty,
                      rating: (4.5 + Math.random() * 0.5).toFixed(1),
                      ratingCount: Math.floor(Math.random() * 200) + 50,
                      availableSlots: [],
                      isLoadingSlots: true
                    });
                  });
                  _this4.updateAllDoctorSchedules();
                }
                _context3.next = 13;
                break;
              case 9:
                _context3.prev = 9;
                _context3.t0 = _context3["catch"](2);
                console.error("获取医生列表失败:", _context3.t0);
                uni.showToast({
                  title: '医生加载失败',
                  icon: 'none'
                });
              case 13:
                _context3.prev = 13;
                _this4.isLoadingDoctors = false;
                return _context3.finish(13);
              case 16:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[2, 9, 13, 16]]);
      }))();
    },
    updateAllDoctorSchedules: function updateAllDoctorSchedules() {
      var _this5 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4() {
        var schedulePromises;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (_this5.selectedDate) {
                  _context4.next = 2;
                  break;
                }
                return _context4.abrupt("return");
              case 2:
                schedulePromises = _this5.doctorsList.map(function (doctor) {
                  return _this5.updateDoctorSchedule(doctor);
                });
                _context4.next = 5;
                return Promise.all(schedulePromises);
              case 5:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }))();
    },
    updateDoctorSchedule: function updateDoctorSchedule(doctor) {
      var _this6 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5() {
        var scheduleRes, bookingsRes, allSlots, weeklySchedule, bookedSlots, availableSlots;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _this6.$set(doctor, 'isLoadingSlots', true);
                _this6.$set(doctor, 'availableSlots', []);
                _context5.prev = 2;
                _context5.next = 5;
                return _kingdeeAgent.default.getDoctorWeeklySchedule(doctor.number);
              case 5:
                scheduleRes = _context5.sent;
                _context5.next = 8;
                return _kingdeeAgent.default.getAppointmentsByDate(doctor.number, _this6.selectedDate.fullDate);
              case 8:
                bookingsRes = _context5.sent;
                allSlots = [];
                if (scheduleRes && scheduleRes.data && scheduleRes.data.rows.length > 0 && scheduleRes.data.rows[0].lb77_weekschedule) {
                  weeklySchedule = scheduleRes.data.rows[0].lb77_weekschedule;
                  allSlots = weeklySchedule.filter(function (slot) {
                    return slot.lb77_day_of_week.trim() === _this6.selectedDate.weekday;
                  }).map(function (slot) {
                    return {
                      start: slot.lb77_start_time,
                      end: slot.lb77_end_time
                    };
                  });
                }
                bookedSlots = [];
                if (bookingsRes && bookingsRes.data && bookingsRes.data.rows) {
                  bookedSlots = bookingsRes.data.rows.map(function (booking) {
                    return booking.lb77_starttime;
                  });
                }
                availableSlots = allSlots.filter(function (slot) {
                  return !bookedSlots.includes(slot.start);
                }).map(function (slot) {
                  return _this6.secondsToTime(slot.start);
                });
                _this6.$set(doctor, 'availableSlots', availableSlots);
                _context5.next = 21;
                break;
              case 17:
                _context5.prev = 17;
                _context5.t0 = _context5["catch"](2);
                console.error("\u83B7\u53D6\u533B\u751F ".concat(doctor.name, " \u7684\u6392\u73ED\u5931\u8D25:"), _context5.t0);
                _this6.$set(doctor, 'availableSlots', []);
              case 21:
                _context5.prev = 21;
                _this6.$set(doctor, 'isLoadingSlots', false);
                return _context5.finish(21);
              case 24:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[2, 17, 21, 24]]);
      }))();
    },
    // ===================================================================
    // ========================= 预约挂号页面事件 ========================
    // ===================================================================
    selectDepartment: function selectDepartment(dept) {
      var _this7 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6() {
        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (!(_this7.selectedDepartment && _this7.selectedDepartment.number === dept.number)) {
                  _context6.next = 2;
                  break;
                }
                return _context6.abrupt("return");
              case 2:
                _this7.selectedDepartment = dept;
                _context6.next = 5;
                return _this7.fetchDoctors(dept.number);
              case 5:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }))();
    },
    selectDate: function selectDate(date) {
      if (this.selectedDate && this.selectedDate.fullDate === date.fullDate) return;
      this.selectedDate = date;
      if (this.doctorsList.length > 0) {
        this.updateAllDoctorSchedules();
      }
    },
    showDoctorDetail: function showDoctorDetail(doctor) {
      this.currentDoctor = doctor;
      this.selectedTimeInPopup = null; // 重置时间选择
      this.showDoctorDetailPopup = true;
    },
    hideDoctorDetail: function hideDoctorDetail() {
      this.showDoctorDetailPopup = false;
    },
    selectSlotInPopup: function selectSlotInPopup(time) {
      this.selectedTimeInPopup = time;
    },
    isSlotSelectedInPopup: function isSlotSelectedInPopup(time) {
      return this.selectedTimeInPopup === time;
    },
    submitAppointment: function submitAppointment() {
      var _this8 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee7() {
        var timeParts, startTimeInSeconds, endTimeInSeconds, appointmentData, res;
        return _regenerator.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (!(!_this8.currentDoctor.number || !_this8.selectedTimeInPopup)) {
                  _context7.next = 3;
                  break;
                }
                uni.showToast({
                  title: '请选择预约时间',
                  icon: 'none'
                });
                return _context7.abrupt("return");
              case 3:
                uni.showLoading({
                  title: '正在提交...'
                });
                _context7.prev = 4;
                timeParts = _this8.selectedTimeInPopup.split(':');
                startTimeInSeconds = parseInt(timeParts[0]) * 3600 + parseInt(timeParts[1]) * 60;
                endTimeInSeconds = startTimeInSeconds + 15 * 60;
                appointmentData = {
                  billno: "YUYUE-".concat(_this8.currentUser.studentId, "-").concat(Date.now()),
                  lb77_appointment_date: _this8.selectedDate.fullDate,
                  lb77_starttime: startTimeInSeconds,
                  lb77_endtime: endTimeInSeconds,
                  lb77_symptoms: "用户自助预约",
                  lb77_appointment_status: '已预约',
                  lb77_student_number: _this8.currentUser.studentId,
                  lb77_doctor_number: _this8.currentDoctor.number
                };
                _context7.next = 11;
                return _kingdeeAgent.default.createMedicalAppointment(appointmentData);
              case 11:
                res = _context7.sent;
                if (!(res && res.data && res.data.successCount > 0)) {
                  _context7.next = 21;
                  break;
                }
                uni.hideLoading();
                _this8.hideDoctorDetail();
                _this8.appointmentResult = {
                  department: _this8.selectedDepartment.name,
                  doctorName: _this8.currentDoctor.name,
                  date: _this8.selectedDate.fullDate,
                  time: _this8.selectedTimeInPopup,
                  location: "\u6821\u533B\u9662 ".concat(_this8.selectedDepartment.name)
                };
                _this8.showAppointmentSuccess = true;
                _this8.fetchMyAppointments();
                _this8.updateAllDoctorSchedules();
                _context7.next = 22;
                break;
              case 21:
                throw new Error(res.message || '预约失败');
              case 22:
                _context7.next = 30;
                break;
              case 24:
                _context7.prev = 24;
                _context7.t0 = _context7["catch"](4);
                uni.hideLoading();
                console.error("创建预约失败:", _context7.t0);
                uni.showToast({
                  title: _context7.t0.message || '预约失败，该时段可能已被预约',
                  icon: 'none'
                });
                _this8.updateAllDoctorSchedules();
              case 30:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[4, 24]]);
      }))();
    },
    // ===================================================================
    // ========================= 其他页面和通用事件 ========================
    // ===================================================================
    switchTab: function switchTab(index) {
      this.currentTab = index;
    },
    fetchMyAppointments: function fetchMyAppointments() {
      var _this9 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee8() {
        var res;
        return _regenerator.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _this9.isLoadingAppointments = true;
                _context8.prev = 1;
                _context8.next = 4;
                return _kingdeeAgent.default.getPersonalAppointments(_this9.currentUser.studentId, 50);
              case 4:
                res = _context8.sent;
                if (res && res.data && res.data.rows) {
                  _this9.myAppointments = res.data.rows.sort(function (a, b) {
                    var dateA = new Date(a.lb77_appointment_date).getTime();
                    var dateB = new Date(b.lb77_appointment_date).getTime();
                    if (dateB !== dateA) return dateB - dateA;
                    return b.lb77_starttime - a.lb77_starttime;
                  });
                } else {
                  _this9.myAppointments = [];
                }
                _context8.next = 12;
                break;
              case 8:
                _context8.prev = 8;
                _context8.t0 = _context8["catch"](1);
                console.error("获取我的预约记录失败:", _context8.t0);
                uni.showToast({
                  title: '预约记录加载失败',
                  icon: 'none'
                });
              case 12:
                _context8.prev = 12;
                _this9.isLoadingAppointments = false;
                return _context8.finish(12);
              case 15:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, null, [[1, 8, 12, 15]]);
      }))();
    },
    fetchMedicalRecords: function fetchMedicalRecords() {
      var _this10 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee9() {
        var res;
        return _regenerator.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                if (!(!_this10.currentUser || !_this10.currentUser.studentId)) {
                  _context9.next = 2;
                  break;
                }
                return _context9.abrupt("return");
              case 2:
                _this10.isLoadingMedicalRecords = true;
                _context9.prev = 3;
                _context9.next = 6;
                return _kingdeeAgent.default.getMedicalRecords(_this10.currentUser.studentId);
              case 6:
                res = _context9.sent;
                if (res && res.data && Array.isArray(res.data.rows)) {
                  _this10.medicalRecords = res.data.rows.map(function (record) {
                    return _objectSpread(_objectSpread({}, record), {}, {
                      disease: record.lb77_diagnosis,
                      date: (record.lb77_fdate || '').split(' ')[0],
                      doctorName: record.lb77_doctor_name,
                      doctorTitle: record.lb77_doctor_lb77_title,
                      description: record.lb77_advice || '暂无医嘱详情'
                    });
                  });
                }
                _context9.next = 14;
                break;
              case 10:
                _context9.prev = 10;
                _context9.t0 = _context9["catch"](3);
                console.error("获取就诊记录失败:", _context9.t0);
                uni.showToast({
                  title: '就诊记录加载失败',
                  icon: 'none'
                });
              case 14:
                _context9.prev = 14;
                _this10.isLoadingMedicalRecords = false;
                return _context9.finish(14);
              case 17:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, null, [[3, 10, 14, 17]]);
      }))();
    },
    cancelAppointment: function cancelAppointment(appointment) {
      var _this11 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee11() {
        return _regenerator.default.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                uni.showModal({
                  title: '取消预约',
                  content: '确定要取消此次预约吗？',
                  success: function () {
                    var _success = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee10(res) {
                      var apiRes;
                      return _regenerator.default.wrap(function _callee10$(_context10) {
                        while (1) {
                          switch (_context10.prev = _context10.next) {
                            case 0:
                              if (!res.confirm) {
                                _context10.next = 21;
                                break;
                              }
                              uni.showLoading({
                                title: '正在取消...'
                              });
                              _context10.prev = 2;
                              _context10.next = 5;
                              return _kingdeeAgent.default.cancelMedicalAppointment(appointment.billno);
                            case 5:
                              apiRes = _context10.sent;
                              if (!(apiRes && apiRes.data && apiRes.data.successCount > 0)) {
                                _context10.next = 13;
                                break;
                              }
                              uni.hideLoading();
                              uni.showToast({
                                title: '预约已取消',
                                icon: 'success'
                              });
                              _this11.fetchMyAppointments();
                              if (_this11.showAppointmentDetail) {
                                _this11.hideAppointmentDetail();
                              }
                              _context10.next = 14;
                              break;
                            case 13:
                              throw new Error(apiRes.message || '取消失败');
                            case 14:
                              _context10.next = 21;
                              break;
                            case 16:
                              _context10.prev = 16;
                              _context10.t0 = _context10["catch"](2);
                              uni.hideLoading();
                              console.error('取消预约失败:', _context10.t0);
                              uni.showToast({
                                title: _context10.t0.message || '取消操作失败',
                                icon: 'none'
                              });
                            case 21:
                            case "end":
                              return _context10.stop();
                          }
                        }
                      }, _callee10, null, [[2, 16]]);
                    }));
                    function success(_x) {
                      return _success.apply(this, arguments);
                    }
                    return success;
                  }()
                });
              case 1:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11);
      }))();
    },
    hideAppointmentSuccess: function hideAppointmentSuccess() {
      this.showAppointmentSuccess = false;
      this.currentTab = 1;
      this.currentStatusTab = 1;
    },
    switchStatusTab: function switchStatusTab(index) {
      this.currentStatusTab = index;
    },
    viewAppointmentDetail: function viewAppointmentDetail(appointment) {
      this.currentAppointment = appointment;
      this.showAppointmentDetail = true;
    },
    hideAppointmentDetail: function hideAppointmentDetail() {
      this.showAppointmentDetail = false;
    },
    confirmCancelAppointment: function confirmCancelAppointment() {
      this.cancelAppointment(this.currentAppointment);
    },
    secondsToTime: function secondsToTime(seconds) {
      if (isNaN(seconds)) return '';
      var h = Math.floor(seconds / 3600).toString().padStart(2, '0');
      var m = Math.floor(seconds % 3600 / 60).toString().padStart(2, '0');
      return "".concat(h, ":").concat(m);
    },
    formatDate: function formatDate(date, fmt) {
      var o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate()
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(RegExp.$1, ("00" + o[k]).substr(("" + o[k]).length));
        }
      }
      return fmt;
    },
    getStatusClass: function getStatusClass(status) {
      switch (status) {
        case '已预约':
        case '待就诊':
          return 'status-pending';
        case '已完成':
          return 'status-completed';
        case '已取消':
          return 'status-canceled';
        default:
          return '';
      }
    },
    switchRecordType: function switchRecordType(index) {
      this.currentRecordType = index;
    },
    viewRecordDetail: function viewRecordDetail(record) {
      var _this12 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee12() {
        var res;
        return _regenerator.default.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _this12.isLoadingRecordDetail = true;
                _this12.showMedicalRecordDetail = true;
                _this12.currentMedicalRecord = {};
                _context12.prev = 3;
                _context12.next = 6;
                return _kingdeeAgent.default.getMedicalRecordDetails(record.billno);
              case 6:
                res = _context12.sent;
                if (!(res && res.data && res.data.rows && res.data.rows.length > 0)) {
                  _context12.next = 11;
                  break;
                }
                _this12.currentMedicalRecord = res.data.rows[0];
                _context12.next = 12;
                break;
              case 11:
                throw new Error('未找到该条记录的详细信息');
              case 12:
                _context12.next = 19;
                break;
              case 14:
                _context12.prev = 14;
                _context12.t0 = _context12["catch"](3);
                console.error("获取就诊记录详情失败:", _context12.t0);
                uni.showToast({
                  title: _context12.t0.message || '加载详情失败',
                  icon: 'none'
                });
                _this12.hideMedicalRecordDetail();
              case 19:
                _context12.prev = 19;
                _this12.isLoadingRecordDetail = false;
                return _context12.finish(19);
              case 22:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, null, [[3, 14, 19, 22]]);
      }))();
    },
    hideMedicalRecordDetail: function hideMedicalRecordDetail() {
      this.showMedicalRecordDetail = false;
      this.currentMedicalRecord = {};
    },
    viewExamReport: function viewExamReport(report) {
      uni.showToast({
        title: '查看报告: ' + report.title,
        icon: 'none'
      });
    },
    getReportStatusClass: function getReportStatusClass(status) {
      switch (status) {
        case '正常':
          return 'status-normal';
        case '异常':
          return 'status-abnormal';
        default:
          return '';
      }
    },
    reserveVaccine: function reserveVaccine(vaccine) {
      uni.showToast({
        title: '预约接种: ' + vaccine.name,
        icon: 'none'
      });
    },
    getVaccineStatusClass: function getVaccineStatusClass(status) {
      switch (status) {
        case '已接种':
          return 'status-vaccinated';
        case '未接种':
          return 'status-unvaccinated';
        default:
          return '';
      }
    }
  }
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ }),

/***/ 165:
/*!***********************************************************************************!*\
  !*** D:/软件杯/校园智能体小程序/pages/features/medical.vue?vue&type=style&index=0&lang=css& ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_medical_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--6-oneOf-1-3!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./medical.vue?vue&type=style&index=0&lang=css& */ 166);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_medical_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_medical_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_medical_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_medical_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_medical_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 166:
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!./node_modules/postcss-loader/src??ref--6-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/软件杯/校园智能体小程序/pages/features/medical.vue?vue&type=style&index=0&lang=css& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[159,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/features/medical.js.map