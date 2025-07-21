(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/features/psychological-assessment"],{

/***/ 135:
/*!**************************************************************************************!*\
  !*** D:/软件杯/校园智能体小程序/main.js?{"page":"pages%2Ffeatures%2Fpsychological-assessment"} ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, createPage) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
__webpack_require__(/*! uni-pages */ 26);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
var _psychologicalAssessment = _interopRequireDefault(__webpack_require__(/*! ./pages/features/psychological-assessment.vue */ 136));
// @ts-ignore
wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;
createPage(_psychologicalAssessment.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["createPage"]))

/***/ }),

/***/ 136:
/*!*******************************************************************!*\
  !*** D:/软件杯/校园智能体小程序/pages/features/psychological-assessment.vue ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _psychological_assessment_vue_vue_type_template_id_57e36e83___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./psychological-assessment.vue?vue&type=template&id=57e36e83& */ 137);
/* harmony import */ var _psychological_assessment_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./psychological-assessment.vue?vue&type=script&lang=js& */ 139);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _psychological_assessment_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _psychological_assessment_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _psychological_assessment_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./psychological-assessment.vue?vue&type=style&index=0&lang=css& */ 141);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 32);

var renderjs





/* normalize component */

var component = Object(_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _psychological_assessment_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _psychological_assessment_vue_vue_type_template_id_57e36e83___WEBPACK_IMPORTED_MODULE_0__["render"],
  _psychological_assessment_vue_vue_type_template_id_57e36e83___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null,
  false,
  _psychological_assessment_vue_vue_type_template_id_57e36e83___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "pages/features/psychological-assessment.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 137:
/*!**************************************************************************************************!*\
  !*** D:/软件杯/校园智能体小程序/pages/features/psychological-assessment.vue?vue&type=template&id=57e36e83& ***!
  \**************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_psychological_assessment_vue_vue_type_template_id_57e36e83___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./psychological-assessment.vue?vue&type=template&id=57e36e83& */ 138);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_psychological_assessment_vue_vue_type_template_id_57e36e83___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_psychological_assessment_vue_vue_type_template_id_57e36e83___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_psychological_assessment_vue_vue_type_template_id_57e36e83___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_psychological_assessment_vue_vue_type_template_id_57e36e83___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 138:
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/软件杯/校园智能体小程序/pages/features/psychological-assessment.vue?vue&type=template&id=57e36e83& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
      return Promise.all(/*! import() | uni_modules/uni-load-more/components/uni-load-more/uni-load-more */[__webpack_require__.e("common/vendor"), __webpack_require__.e("uni_modules/uni-load-more/components/uni-load-more/uni-load-more")]).then(__webpack_require__.bind(null, /*! @/uni_modules/uni-load-more/components/uni-load-more/uni-load-more.vue */ 352))
    },
    uniSegmentedControl: function () {
      return __webpack_require__.e(/*! import() | uni_modules/uni-segmented-control/components/uni-segmented-control/uni-segmented-control */ "uni_modules/uni-segmented-control/components/uni-segmented-control/uni-segmented-control").then(__webpack_require__.bind(null, /*! @/uni_modules/uni-segmented-control/components/uni-segmented-control/uni-segmented-control.vue */ 363))
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
  var l1 =
    _vm.currentTab === 0 && _vm.assessmentStep === "answering"
      ? _vm.__map(
          _vm.currentQuestionnaire.questions,
          function (question, index) {
            var $orig = _vm.__get_orig(question)
            var l0 = _vm.__map(question.options, function (option, oIndex) {
              var $orig = _vm.__get_orig(option)
              var m0 = String(oIndex)
              return {
                $orig: $orig,
                m0: m0,
              }
            })
            return {
              $orig: $orig,
              l0: l0,
            }
          }
        )
      : null
  var l2 =
    _vm.currentTab === 1 && !_vm.isLoadingCounselors
      ? _vm.__map(_vm.counselors, function (counselor, index) {
          var $orig = _vm.__get_orig(counselor)
          var g0 = counselor.rating.toFixed(1)
          return {
            $orig: $orig,
            g0: g0,
          }
        })
      : null
  var g1 =
    _vm.currentTab === 2 && _vm.recordsTab === 0 && !_vm.isLoadingReports
      ? _vm.myPsychReports.length
      : null
  var l3 =
    _vm.currentTab === 2 &&
    _vm.recordsTab === 0 &&
    !_vm.isLoadingReports &&
    !(g1 === 0)
      ? _vm.__map(_vm.myPsychReports, function (report, __i2__) {
          var $orig = _vm.__get_orig(report)
          var m1 = _vm.formatDate(new Date(report.createtime), "yyyy-MM-dd")
          return {
            $orig: $orig,
            m1: m1,
          }
        })
      : null
  var g2 =
    _vm.currentTab === 2 && _vm.recordsTab === 1 && !_vm.isLoadingAppointments
      ? _vm.myAppointments.length
      : null
  var l4 =
    _vm.currentTab === 2 &&
    _vm.recordsTab === 1 &&
    !_vm.isLoadingAppointments &&
    !(g2 === 0)
      ? _vm.__map(_vm.processedAppointments, function (apt, __i3__) {
          var $orig = _vm.__get_orig(apt)
          var m2 = _vm.formatDate(
            new Date(apt.lb77_appointment_date),
            "yyyy-MM-dd"
          )
          var m3 = _vm.secondsToTime(apt.lb77_starttime)
          return {
            $orig: $orig,
            m2: m2,
            m3: m3,
          }
        })
      : null
  var g3 = _vm.showCounselorDetailPopup
    ? _vm.currentCounselor.rating.toFixed(1)
    : null
  var g4 =
    _vm.showCounselorDetailPopup && !_vm.isLoadingSchedule
      ? _vm.availableTimeSlots.length
      : null
  _vm.$mp.data = Object.assign(
    {},
    {
      $root: {
        l1: l1,
        l2: l2,
        g1: g1,
        l3: l3,
        g2: g2,
        l4: l4,
        g3: g3,
        g4: g4,
      },
    }
  )
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 139:
/*!********************************************************************************************!*\
  !*** D:/软件杯/校园智能体小程序/pages/features/psychological-assessment.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_psychological_assessment_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./psychological-assessment.vue?vue&type=script&lang=js& */ 140);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_psychological_assessment_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_psychological_assessment_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_psychological_assessment_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_psychological_assessment_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_psychological_assessment_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 140:
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/软件杯/校园智能体小程序/pages/features/psychological-assessment.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ 5));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ 42));
var _kingdeeAgent = _interopRequireDefault(__webpack_require__(/*! @/services/kingdeeAgent.js */ 43));
var _methods;
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var _default = {
  data: function data() {
    return {
      tabs: ['心理健康评估', '咨询师预约', '我的记录'],
      currentTab: 0,
      currentUser: {
        studentId: '645730151',
        name: '张三'
      },
      // 心理评估
      assessmentStep: 'list',
      // 'list', 'answering', 'report'
      questionnaireList: [],
      currentQuestionnaire: null,
      assessmentReport: null,
      // 咨询师列表
      counselors: [],
      isLoadingCounselors: false,
      // 咨询预约
      showCounselorDetailPopup: false,
      currentCounselor: {},
      selectedDateIndex: 0,
      selectedTime: {},
      availableDates: [],
      availableTimeSlots: [],
      isLoadingSchedule: false,
      // 我的记录
      recordsTab: 0,
      myPsychReports: [],
      isLoadingReports: false,
      myAppointments: [],
      isLoadingAppointments: false
    };
  },
  onLoad: function onLoad(options) {
    var _this = this;
    return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
      var tabIndex, recordsTabIndex, counselor;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this.initAssessment();
              // 等待咨询师列表加载完毕
              _context.next = 3;
              return _this.fetchCounselors();
            case 3:
              if (options) {
                // 处理tab切换
                if (options.tab) {
                  tabIndex = parseInt(options.tab, 10);
                  if (!isNaN(tabIndex) && tabIndex >= 0 && tabIndex < _this.tabs.length) {
                    // 在切换到“我的记录”前，先设置好内部的子tab
                    if (tabIndex === 2 && options.recordstab) {
                      recordsTabIndex = parseInt(options.recordstab, 10);
                      if (!isNaN(recordsTabIndex) && [0, 1].includes(recordsTabIndex)) {
                        _this.recordsTab = recordsTabIndex;
                      }
                    }
                    _this.switchTab(tabIndex);
                  }
                }

                // 处理咨询师推荐
                if (options.recommendCounselorId) {
                  counselor = _this.counselors.find(function (c) {
                    return c.id === options.recommendCounselorId;
                  });
                  if (counselor) {
                    // 确保tab在咨询师列表页
                    if (_this.currentTab !== 1) {
                      _this.switchTab(1);
                    }
                    // 等待UI渲染完毕后，再弹出详情，增加稳定性
                    _this.$nextTick(function () {
                      setTimeout(function () {
                        _this.showCounselorDetail(counselor);
                      }, 100);
                    });
                  } else {
                    console.warn("Recommended counselor with ID ".concat(options.recommendCounselorId, " not found."));
                    uni.showToast({
                      title: '未找到推荐的咨询师',
                      icon: 'none'
                    });
                  }
                }
              }
            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  computed: {
    // 是否所有问题都已回答
    isAllQuestionsAnswered: function isAllQuestionsAnswered() {
      if (!this.currentQuestionnaire || !this.currentQuestionnaire.questions) {
        return false;
      }
      return this.currentQuestionnaire.questions.every(function (q) {
        return q.selected !== null;
      });
    },
    processedAppointments: function processedAppointments() {
      return this.myAppointments.map(function (apt) {
        var statusClass = '';
        switch (apt.lb77_appointment_status) {
          case '已预约':
            statusClass = 'status-booked';
            break;
          case '已完成':
            statusClass = 'status-completed';
            break;
          case '已取消':
            statusClass = 'status-cancelled';
            break;
        }
        return _objectSpread(_objectSpread({}, apt), {}, {
          statusClass: statusClass
        });
      });
    }
  },
  methods: (_methods = {
    // 获取咨询师列表
    fetchCounselors: function fetchCounselors() {
      var _this2 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        var res;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _this2.isLoadingCounselors = true;
                _context2.prev = 1;
                _context2.next = 4;
                return _kingdeeAgent.default.getCounselors(20);
              case 4:
                res = _context2.sent;
                if (res && res.data && Array.isArray(res.data.rows)) {
                  _this2.counselors = res.data.rows.map(function (c, index) {
                    return _objectSpread(_objectSpread({}, c), {}, {
                      id: c.number,
                      name: c.name,
                      title: c.lb77_title,
                      avatar: c.lb77_avatarURL || '/static/images/counselor' + (index % 3 + 1) + '.png',
                      specialties: c.lb77_specialties ? c.lb77_specialties.split(',') : [],
                      background: c.lb77_background,
                      style: c.lb77_style,
                      rating: 4.7 + Math.random() * 0.3,
                      ratingCount: Math.floor(Math.random() * 150) + 50
                    });
                  });
                }
                _context2.next = 12;
                break;
              case 8:
                _context2.prev = 8;
                _context2.t0 = _context2["catch"](1);
                console.error("获取咨询师列表失败:", _context2.t0);
                uni.showToast({
                  title: '咨询师加载失败',
                  icon: 'none'
                });
              case 12:
                _context2.prev = 12;
                _this2.isLoadingCounselors = false;
                return _context2.finish(12);
              case 15:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[1, 8, 12, 15]]);
      }))();
    },
    // 切换Tab
    switchTab: function switchTab(index) {
      this.currentTab = index;
      if (index === 2) {
        // 默认加载第一个子tab的内容
        this.onRecordsTabClick({
          currentIndex: this.recordsTab
        });
      }
    },
    onRecordsTabClick: function onRecordsTabClick(e) {
      var index = e.currentIndex;
      if (this.recordsTab !== index) {
        this.recordsTab = index;
      }
      if (index === 0 && this.myPsychReports.length === 0) {
        this.fetchMyReports();
      } else if (index === 1 && this.myAppointments.length === 0) {
        this.fetchMyAppointments();
      }
    },
    // 开始评估
    startAssessment: function startAssessment(item) {
      uni.showToast({
        title: '开始评估：' + item.title,
        icon: 'none'
      });
      // 这里应该跳转到具体的问卷页面
      // uni.navigateTo({
      // 	url: `/pages/features/assessment-detail?id=${item.id}`
      // });
    },
    // 查看报告
    viewReport: function viewReport(report) {
      uni.showToast({
        title: '查看报告：' + report.title,
        icon: 'none'
      });
      // 这里应该跳转到报告详情页面
      // uni.navigateTo({
      // 	url: `/pages/features/report-detail?id=${report.id}`
      // });
    },
    // 显示咨询师详情
    showCounselorDetail: function showCounselorDetail(counselor) {
      this.currentCounselor = counselor;
      this.generateAvailableDates();
      this.updateCounselorSchedule();
      this.showCounselorDetailPopup = true;
    },
    // 隐藏咨询师详情
    hideCounselorDetail: function hideCounselorDetail() {
      this.showCounselorDetailPopup = false;
    },
    // 动态生成可用日期
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
      this.selectedDateIndex = 0;
      this.selectedTime = {};
    },
    // 更新咨询师排班
    updateCounselorSchedule: function updateCounselorSchedule() {
      var _this3 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        var selectedDate, _yield$Promise$all, _yield$Promise$all2, scheduleRes, bookingsRes, allSlots, bookedSlots;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!(!_this3.currentCounselor.id || _this3.selectedDateIndex < 0)) {
                  _context3.next = 2;
                  break;
                }
                return _context3.abrupt("return");
              case 2:
                _this3.isLoadingSchedule = true;
                _this3.availableTimeSlots = [];
                _this3.selectedTime = {};

                // 确保DOM更新完成后再执行后续操作
                _context3.next = 7;
                return _this3.$nextTick();
              case 7:
                selectedDate = _this3.availableDates[_this3.selectedDateIndex];
                _context3.prev = 8;
                _context3.next = 11;
                return Promise.all([_kingdeeAgent.default.getCounselorWeeklySchedule(_this3.currentCounselor.id), _kingdeeAgent.default.getCounselingAppointmentsByDate(_this3.currentCounselor.id, selectedDate.fullDate)]);
              case 11:
                _yield$Promise$all = _context3.sent;
                _yield$Promise$all2 = (0, _slicedToArray2.default)(_yield$Promise$all, 2);
                scheduleRes = _yield$Promise$all2[0];
                bookingsRes = _yield$Promise$all2[1];
                allSlots = [];
                if (scheduleRes.data && scheduleRes.data.rows.length > 0 && scheduleRes.data.rows[0].entryentity) {
                  allSlots = scheduleRes.data.rows[0].entryentity.filter(function (slot) {
                    return slot.lb77_day_of_week.trim() === selectedDate.weekday;
                  }).map(function (slot) {
                    return {
                      startTime: slot.lb77_start_time,
                      endTime: slot.lb77_end_time
                    };
                  });
                }
                bookedSlots = [];
                if (bookingsRes.data && bookingsRes.data.rows) {
                  bookedSlots = bookingsRes.data.rows.map(function (booking) {
                    return booking.lb77_starttime;
                  });
                }
                _this3.availableTimeSlots = allSlots.filter(function (slot) {
                  return !bookedSlots.includes(slot.startTime);
                }).map(function (slot) {
                  return {
                    time: _this3.secondsToTime(slot.startTime),
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    available: true
                  };
                }).sort(function (a, b) {
                  return a.startTime - b.startTime;
                });
                _context3.next = 26;
                break;
              case 22:
                _context3.prev = 22;
                _context3.t0 = _context3["catch"](8);
                console.error("获取咨询师排班失败:", _context3.t0);
                uni.showToast({
                  title: '号源加载失败',
                  icon: 'none'
                });
              case 26:
                _context3.prev = 26;
                _this3.isLoadingSchedule = false;
                return _context3.finish(26);
              case 29:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[8, 22, 26, 29]]);
      }))();
    },
    // 日期选择器控制 - 已废弃
    previousDate: function previousDate() {
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      });
    },
    nextDate: function nextDate() {
      uni.showToast({
        title: '功能开发中',
        icon: 'none'
      });
    },
    // 选择日期
    selectDate: function selectDate(index) {
      this.selectedDateIndex = index;
      this.updateCounselorSchedule();
    },
    // 选择时间
    selectTime: function selectTime(time) {
      if (time.available) {
        this.selectedTime = time;
      }
    },
    // 预约咨询
    bookAppointment: function bookAppointment() {
      var _this4 = this;
      if (this.selectedTime && this.selectedTime.startTime) {
        var date = this.availableDates[this.selectedDateIndex];
        var time = this.selectedTime;
        uni.showModal({
          title: '预约确认',
          content: "\u60A8\u786E\u5B9A\u8981\u9884\u7EA6".concat(this.currentCounselor.name, "\u54A8\u8BE2\u5E08\u5728 ").concat(date.fullDate, " ").concat(time.time, " \u7684\u54A8\u8BE2\u5417\uFF1F"),
          success: function () {
            var _success = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(res) {
              var studentId;
              return _regenerator.default.wrap(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      if (!res.confirm) {
                        _context4.next = 17;
                        break;
                      }
                      // TODO: 后续应从用户登录状态中获取真实学生ID
                      studentId = "645730151";
                      _context4.prev = 2;
                      uni.showLoading({
                        title: '正在预约...'
                      });
                      _context4.next = 6;
                      return _kingdeeAgent.default.createCounselingAppointment(studentId, _this4.currentCounselor.id, date.fullDate, time.startTime, time.endTime);
                    case 6:
                      uni.hideLoading();
                      uni.showToast({
                        title: '预约成功',
                        icon: 'success',
                        duration: 1500
                      });
                      _this4.hideCounselorDetail();

                      // 预约成功后，延时跳转到我的记录-咨询预约列表
                      setTimeout(function () {
                        uni.redirectTo({
                          url: '/pages/features/psychological-assessment?tab=2&recordstab=1'
                        });
                      }, 1500);
                      _context4.next = 17;
                      break;
                    case 12:
                      _context4.prev = 12;
                      _context4.t0 = _context4["catch"](2);
                      uni.hideLoading();
                      console.error("创建心理咨询预约失败:", _context4.t0);
                      uni.showToast({
                        title: '预约失败，请稍后再试或检查网络',
                        icon: 'none',
                        duration: 2000
                      });
                    case 17:
                    case "end":
                      return _context4.stop();
                  }
                }
              }, _callee4, null, [[2, 12]]);
            }));
            function success(_x) {
              return _success.apply(this, arguments);
            }
            return success;
          }()
        });
      }
    },
    // 时间格式化工具
    secondsToTime: function secondsToTime(seconds) {
      if (isNaN(seconds)) return '';
      var h = Math.floor(seconds / 3600).toString().padStart(2, '0');
      var m = Math.floor(seconds % 3600 / 60).toString().padStart(2, '0');
      return "".concat(h, ":").concat(m);
    },
    formatDate: function formatDate(date, fmt) {
      if (!date || isNaN(new Date(date))) {
        return '';
      }
      date = new Date(date);
      var o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds()
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
      }
      return fmt;
    },
    // -------- 心理评估方法 --------
    initAssessment: function initAssessment() {
      this.questionnaireList = [{
        id: 'GeneralV1',
        title: '通用心理健康评估',
        description: '快速评估您近期的整体心理状态。',
        icon: '/static/images/assessment-icon-1.png',
        questions: [{
          text: "最近一周，我感到精力充沛。",
          options: [{
            text: "完全同意",
            score: 1
          }, {
            text: "比较同意",
            score: 2
          }, {
            text: "不确定",
            score: 3
          }, {
            text: "比较不同意",
            score: 4
          }, {
            text: "完全不同意",
            score: 5
          }],
          selected: null
        }, {
          text: "最近一周，我对未来感到乐观。",
          options: [{
            text: "完全同意",
            score: 1
          }, {
            text: "比较同意",
            score: 2
          }, {
            text: "不确定",
            score: 3
          }, {
            text: "比较不同意",
            score: 4
          }, {
            text: "完全不同意",
            score: 5
          }],
          selected: null
        }, {
          text: "最近一周，我能很好地处理日常压力。",
          options: [{
            text: "完全同意",
            score: 1
          }, {
            text: "比较同意",
            score: 2
          }, {
            text: "不确定",
            score: 3
          }, {
            text: "比较不同意",
            score: 4
          }, {
            text: "完全不同意",
            score: 5
          }],
          selected: null
        }, {
          text: "最近一周，我对自己的能力有信心。",
          options: [{
            text: "完全同意",
            score: 1
          }, {
            text: "比较同意",
            score: 2
          }, {
            text: "不确定",
            score: 3
          }, {
            text: "比较不同意",
            score: 4
          }, {
            text: "完全不同意",
            score: 5
          }],
          selected: null
        }, {
          text: "最近一周，我对参与各种活动兴趣盎然。",
          options: [{
            text: "完全同意",
            score: 1
          }, {
            text: "比较同意",
            score: 2
          }, {
            text: "不确定",
            score: 3
          }, {
            text: "比较不同意",
            score: 4
          }, {
            text: "完全不同意",
            score: 5
          }],
          selected: null
        }]
      }, {
        id: 'SAS',
        title: '焦虑自评量表 (SAS)',
        description: '评估您过去一周内焦虑情绪的严重程度。',
        icon: '/static/images/assessment-icon-2.png',
        questions: [{
          text: "我感到比平常更容易紧张和着急。",
          options: [{
            text: "没有或很少时间",
            score: 1
          }, {
            text: "小部分时间",
            score: 2
          }, {
            text: "相当多时间",
            score: 3
          }, {
            text: "绝大部分或全部时间",
            score: 4
          }],
          selected: null
        }, {
          text: "我无缘无故地感到害怕或恐惧。",
          options: [{
            text: "没有或很少时间",
            score: 1
          }, {
            text: "小部分时间",
            score: 2
          }, {
            text: "相当多时间",
            score: 3
          }, {
            text: "绝大部分或全部时间",
            score: 4
          }],
          selected: null
        }, {
          text: "我容易心里烦乱或感到惊恐。",
          options: [{
            text: "没有或很少时间",
            score: 1
          }, {
            text: "小部分时间",
            score: 2
          }, {
            text: "相当多时间",
            score: 3
          }, {
            text: "绝大部分或全部时间",
            score: 4
          }],
          selected: null
        }]
      }, {
        id: 'SDS',
        title: '抑郁自评量表 (SDS)',
        description: '评估您近期抑郁情绪的体验和严重程度。',
        icon: '/static/images/assessment-icon-3.png',
        questions: [{
          text: "我觉得闷闷不乐，情绪低沉。",
          options: [{
            text: "没有或很少时间",
            score: 1
          }, {
            text: "小部分时间",
            score: 2
          }, {
            text: "相当多时间",
            score: 3
          }, {
            text: "绝大部分或全部时间",
            score: 4
          }],
          selected: null
        }, {
          text: "我感到前景非常暗淡。",
          options: [{
            text: "没有或很少时间",
            score: 1
          }, {
            text: "小部分时间",
            score: 2
          }, {
            text: "相当多时间",
            score: 3
          }, {
            text: "绝大部分或全部时间",
            score: 4
          }],
          selected: null
        }, {
          text: "我对以前感兴趣的事情失去了兴趣。",
          options: [{
            text: "没有或很少时间",
            score: 1
          }, {
            text: "小部分时间",
            score: 2
          }, {
            text: "相当多时间",
            score: 3
          }, {
            text: "绝大部分或全部时间",
            score: 4
          }],
          selected: null
        }]
      }, {
        id: 'SAD',
        title: '社交回避及苦恼量表 (SAD)',
        description: '评估您在社交场合中的回避倾向和感受到的苦恼。',
        icon: '/static/images/assessment-icon-4.png',
        questions: [{
          text: "参加聚会时，我感到不自在。",
          options: [{
            text: "完全不符合",
            score: 1
          }, {
            text: "不太符合",
            score: 2
          }, {
            text: "有点符合",
            score: 3
          }, {
            text: "非常符合",
            score: 4
          }],
          selected: null
        }, {
          text: "我尽量避免成为别人注意的中心。",
          options: [{
            text: "完全不符合",
            score: 1
          }, {
            text: "不太符合",
            score: 2
          }, {
            text: "有点符合",
            score: 3
          }, {
            text: "非常符合",
            score: 4
          }],
          selected: null
        }, {
          text: "我对和陌生人交谈感到紧张。",
          options: [{
            text: "完全不符合",
            score: 1
          }, {
            text: "不太符合",
            score: 2
          }, {
            text: "有点符合",
            score: 3
          }, {
            text: "非常符合",
            score: 4
          }],
          selected: null
        }]
      }];
      this.currentQuestionnaire = null;
      this.assessmentReport = null;
      this.assessmentStep = 'list';
    }
  }, (0, _defineProperty2.default)(_methods, "startAssessment", function startAssessment(questionnaire) {
    // 重置问题的选中状态
    questionnaire.questions.forEach(function (q) {
      return q.selected = null;
    });
    this.currentQuestionnaire = questionnaire;
    this.assessmentStep = 'answering';
  }), (0, _defineProperty2.default)(_methods, "handleRadioChange", function handleRadioChange(event, questionIndex) {
    var selectedOptionIndex = parseInt(event.detail.value);
    this.currentQuestionnaire.questions[questionIndex].selected = selectedOptionIndex;
  }), (0, _defineProperty2.default)(_methods, "submitAssessment", function submitAssessment() {
    var _this5 = this;
    return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5() {
      var totalScore, level, suggestion, studentId, entries;
      return _regenerator.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (_this5.isAllQuestionsAnswered) {
                _context5.next = 3;
                break;
              }
              uni.showToast({
                title: '请回答所有问题',
                icon: 'none'
              });
              return _context5.abrupt("return");
            case 3:
              totalScore = _this5.currentQuestionnaire.questions.reduce(function (sum, question) {
                return sum + question.options[question.selected].score;
              }, 0);
              level = '';
              suggestion = ''; // Note: 这里的评分标准是通用的，实际应用中不同问卷应有不同标准
              if (totalScore <= _this5.currentQuestionnaire.questions.length * 2) {
                level = '心理状态良好';
                suggestion = '您的心理状态比较健康，能够较好地应对生活中的挑战。建议继续保持，并适当进行放松活动。';
              } else if (totalScore <= _this5.currentQuestionnaire.questions.length * 3.5) {
                level = '轻度心理困扰';
                suggestion = '您可能正面临一些压力或情绪困扰。建议主动与朋友、家人沟通，或考虑寻求专业心理咨询。';
              } else {
                level = '需要关注';
                suggestion = '您的心理状态需要引起重视。强力建议您预约专业心理咨询师进行深入沟通，以获得及时有效的帮助。';
              }
              uni.showLoading({
                title: '正在生成报告...'
              });
              _context5.prev = 8;
              // TODO: 后续应从用户登录状态中获取真实学生ID
              studentId = "645730151";
              entries = _this5.currentQuestionnaire.questions.map(function (q, index) {
                return {
                  lb77_questionindex: index + 1,
                  lb77_selecttext: q.options[q.selected].text,
                  lb77_score: q.options[q.selected].score
                };
              });
              _context5.next = 13;
              return _kingdeeAgent.default.createPsychReport(studentId, totalScore, level,
              // 使用 level 作为 ResultSummary
              entries, _this5.currentQuestionnaire.id, _this5.currentQuestionnaire.title);
            case 13:
              _this5.assessmentReport = {
                score: totalScore,
                level: level,
                suggestion: suggestion
              };
              _this5.assessmentStep = 'report';
              uni.hideLoading();
              uni.showToast({
                title: '报告生成成功',
                icon: 'success'
              });
              _context5.next = 24;
              break;
            case 19:
              _context5.prev = 19;
              _context5.t0 = _context5["catch"](8);
              uni.hideLoading();
              console.error("创建心理评估报告失败:", _context5.t0);
              uni.showToast({
                title: '报告提交失败，请重试',
                icon: 'none'
              });
            case 24:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[8, 19]]);
    }))();
  }), (0, _defineProperty2.default)(_methods, "resetAssessment", function resetAssessment() {
    this.initAssessment();
    this.myPsychReports = [];
  }), (0, _defineProperty2.default)(_methods, "fetchMyReports", function fetchMyReports() {
    var _this6 = this;
    return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6() {
      var studentId, res;
      return _regenerator.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _this6.isLoadingReports = true;
              // 确保DOM更新完成后再执行后续操作，防止uni-load-more组件报错
              _context6.next = 3;
              return _this6.$nextTick();
            case 3:
              _context6.prev = 3;
              // TODO: 后续应从用户登录状态中获取真实学生ID
              studentId = "645730151";
              _context6.next = 7;
              return _kingdeeAgent.default.getMyPsychReports(studentId);
            case 7:
              res = _context6.sent;
              if (res.data && res.data.rows) {
                _this6.myPsychReports = res.data.rows.sort(function (a, b) {
                  return new Date(b.createtime) - new Date(a.createtime);
                });
              } else {
                _this6.myPsychReports = [];
              }
              _context6.next = 15;
              break;
            case 11:
              _context6.prev = 11;
              _context6.t0 = _context6["catch"](3);
              console.error("获取心理评估报告列表失败:", _context6.t0);
              uni.showToast({
                title: '报告加载失败',
                icon: 'none'
              });
            case 15:
              _context6.prev = 15;
              _this6.isLoadingReports = false;
              return _context6.finish(15);
            case 18:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, null, [[3, 11, 15, 18]]);
    }))();
  }), (0, _defineProperty2.default)(_methods, "fetchMyAppointments", function fetchMyAppointments() {
    var _this7 = this;
    return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee7() {
      var studentId, res;
      return _regenerator.default.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _this7.isLoadingAppointments = true;
              _context7.next = 3;
              return _this7.$nextTick();
            case 3:
              _context7.prev = 3;
              // TODO: 后续应从用户登录状态中获取真实学生ID
              studentId = "645730151";
              _context7.next = 7;
              return _kingdeeAgent.default.getMyCounselingAppointments(studentId);
            case 7:
              res = _context7.sent;
              if (res.data && res.data.rows) {
                _this7.myAppointments = res.data.rows.sort(function (a, b) {
                  return new Date(b.lb77_appointment_date) - new Date(a.lb77_appointment_date);
                });
              } else {
                _this7.myAppointments = [];
              }
              _context7.next = 15;
              break;
            case 11:
              _context7.prev = 11;
              _context7.t0 = _context7["catch"](3);
              console.error("获取我的咨询预约列表失败:", _context7.t0);
              uni.showToast({
                title: '预约记录加载失败',
                icon: 'none'
              });
            case 15:
              _context7.prev = 15;
              _this7.isLoadingAppointments = false;
              return _context7.finish(15);
            case 18:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, null, [[3, 11, 15, 18]]);
    }))();
  }), (0, _defineProperty2.default)(_methods, "confirmCancelAppointment", function confirmCancelAppointment(appointmentId) {
    var _this8 = this;
    uni.showModal({
      title: '确认取消',
      content: '您确定要取消本次预约吗？',
      success: function () {
        var _success2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee8(res) {
          return _regenerator.default.wrap(function _callee8$(_context8) {
            while (1) {
              switch (_context8.prev = _context8.next) {
                case 0:
                  if (res.confirm) {
                    _this8.cancelAppointment(appointmentId);
                  }
                case 1:
                case "end":
                  return _context8.stop();
              }
            }
          }, _callee8);
        }));
        function success(_x2) {
          return _success2.apply(this, arguments);
        }
        return success;
      }()
    });
  }), (0, _defineProperty2.default)(_methods, "cancelAppointment", function cancelAppointment(appointmentId) {
    var _this9 = this;
    return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee9() {
      return _regenerator.default.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              uni.showLoading({
                title: '正在取消...'
              });
              _context9.prev = 1;
              _context9.next = 4;
              return _kingdeeAgent.default.cancelCounselingAppointment(appointmentId);
            case 4:
              uni.hideLoading();
              uni.showToast({
                title: '取消成功',
                icon: 'success'
              });
              // 刷新列表
              _this9.fetchMyAppointments();
              _context9.next = 14;
              break;
            case 9:
              _context9.prev = 9;
              _context9.t0 = _context9["catch"](1);
              uni.hideLoading();
              console.error("取消预约失败:", _context9.t0);
              uni.showToast({
                title: '取消失败，请稍后再试',
                icon: 'none'
              });
            case 14:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, null, [[1, 9]]);
    }))();
  }), _methods)
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ }),

/***/ 141:
/*!****************************************************************************************************!*\
  !*** D:/软件杯/校园智能体小程序/pages/features/psychological-assessment.vue?vue&type=style&index=0&lang=css& ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_psychological_assessment_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--6-oneOf-1-3!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../app/HBuilderX.4.64.2025042916/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./psychological-assessment.vue?vue&type=style&index=0&lang=css& */ 142);
/* harmony import */ var _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_psychological_assessment_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_psychological_assessment_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_psychological_assessment_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_psychological_assessment_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_app_HBuilderX_4_64_2025042916_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_psychological_assessment_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 142:
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!./node_modules/postcss-loader/src??ref--6-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/软件杯/校园智能体小程序/pages/features/psychological-assessment.vue?vue&type=style&index=0&lang=css& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[135,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/features/psychological-assessment.js.map