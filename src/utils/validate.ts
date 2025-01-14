export type ErrorCallbackType = (error?: string | undefined) => void;

// validate phone
export function validatePhone(_rules: any, value: any, callback?: ErrorCallbackType) {
  const reg = /^1[3-9]\d{9}$/;
  const isError = !value || value.length !== 11 || reg.test(value) !== true;
  if (callback) {
    return isError ? callback('请输入11位有效的手机号码') : callback();
  } else {
    return isError;
  }
}

// validate URL
export function validateURL(_rules: any, value: any, callback?: ErrorCallbackType) {
  const reg =
    /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  const isError = !value || reg.test(value) !== true;
  if (callback) {
    return isError ? callback('请输入正确的URL地址') : callback();
  } else {
    return isError;
  }
}

// validate Email
export function validateEmail(_rules: any, value: any, callback?: ErrorCallbackType) {
  const reg = /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
  const isError = !value || reg.test(value) !== true;
  if (callback) {
    return isError ? callback('请输入正确的邮箱') : callback();
  } else {
    return isError;
  }
}
