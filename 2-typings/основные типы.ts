"use strict";

var makeOrdinal = require("./makeOrdinal");
var isFinite = require("./isFinite");
var isSafeNumber = require("./isSafeNumber");
enum NumberClasses {
  TEN = 10,
  ONE_HUNDRED = 100,
  ONE_THOUSAND = 1000,
  ONE_MILLION = 1000000,
  ONE_BILLION = 1000000000,
  ONE_TRILLION = 1000000000000,
  ONE_QUADRILLION = 1000000000000000,
  MAX = 9007199254740992,
}

enum LESS_THAN_TWENTY {
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
}

enum TENTHS_LESS_THAN_HUNDRED {
  "zero",
  "ten",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
}
/**
 * Converts an integer into words.
 * If number is decimal, the decimals will be removed.
 * @example toWords(12) => 'twelve'
 * @param {number|string} number
 * @param {boolean} [asOrdinal] - Deprecated, use toWordsOrdinal() instead!
 * @returns {string}
 */
function toWords(number: string, asOrdinal: boolean): string {
  var words;
  var num = parseInt(number, 10);

  if (!isFinite(num)) {
    throw new TypeError(
      "Not a finite number: " + number + " (" + typeof number + ")"
    );
  }
  if (!isSafeNumber(num)) {
    throw new RangeError(
      "Input is not a safe number, it’s either too large or too small."
    );
  }
  words = generateWords(num);
  return asOrdinal ? makeOrdinal(words) : words;
}

function generateWords(number: number): string {
  var remainder,
    word,
    words = arguments[1];

  // We’re done
  if (number === 0) {
    return !words ? "zero" : words.join(" ").replace(/,$/, "");
  }
  // First run
  if (!words) {
    words = [];
  }
  // If negative, prepend “minus”
  if (number < 0) {
    words.push("minus");
    number = Math.abs(number);
  }

  if (number < 20) {
    remainder = 0;
    word = LESS_THAN_TWENTY[number];
  } else if (number < NumberClasses.ONE_HUNDRED) {
    remainder = number % NumberClasses.TEN;
    word = TENTHS_LESS_THAN_HUNDRED[Math.floor(number / NumberClasses.TEN)];
    // In case of remainder, we need to handle it here to be able to add the “-”
    if (remainder) {
      word += "-" + LESS_THAN_TWENTY[remainder];
      remainder = 0;
    }
  } else if (number < NumberClasses.ONE_THOUSAND) {
    remainder = number % NumberClasses.ONE_HUNDRED;
    word =
      generateWords(Math.floor(number / NumberClasses.ONE_HUNDRED)) +
      " hundred";
  } else if (number < NumberClasses.ONE_MILLION) {
    remainder = number % NumberClasses.ONE_THOUSAND;
    word =
      generateWords(Math.floor(number / NumberClasses.ONE_THOUSAND)) +
      " thousand,";
  } else if (number < NumberClasses.ONE_BILLION) {
    remainder = number % NumberClasses.ONE_MILLION;
    word =
      generateWords(Math.floor(number / NumberClasses.ONE_MILLION)) +
      " million,";
  } else if (number < NumberClasses.ONE_TRILLION) {
    remainder = number % NumberClasses.ONE_BILLION;
    word =
      generateWords(Math.floor(number / NumberClasses.ONE_BILLION)) +
      " billion,";
  } else if (number < NumberClasses.ONE_QUADRILLION) {
    remainder = number % NumberClasses.ONE_TRILLION;
    word =
      generateWords(Math.floor(number / NumberClasses.ONE_TRILLION)) +
      " trillion,";
  } else if (number <= NumberClasses.MAX) {
    remainder = number % NumberClasses.ONE_QUADRILLION;
    word =
      generateWords(Math.floor(number / NumberClasses.ONE_QUADRILLION)) +
      " quadrillion,";
  }

  words.push(word);
  return generateWords(remainder, words);
}

module.exports = toWords;
