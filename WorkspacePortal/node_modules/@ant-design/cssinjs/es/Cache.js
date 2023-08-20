import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
// [times, realValue]

var SPLIT = '%';
var Entity = /*#__PURE__*/function () {
  function Entity(instanceId) {
    _classCallCheck(this, Entity);
    _defineProperty(this, "instanceId", void 0);
    /** @private Internal cache map. Do not access this directly */
    _defineProperty(this, "cache", new Map());
    this.instanceId = instanceId;
  }
  _createClass(Entity, [{
    key: "get",
    value: function get(keys) {
      return this.cache.get(keys.join(SPLIT)) || null;
    }
  }, {
    key: "update",
    value: function update(keys, valueFn) {
      var path = keys.join(SPLIT);
      var prevValue = this.cache.get(path);
      var nextValue = valueFn(prevValue);
      if (nextValue === null) {
        this.cache.delete(path);
      } else {
        this.cache.set(path, nextValue);
      }
    }
  }]);
  return Entity;
}();
export default Entity;