/*
    Copyright 2014 Mark Richards mark.richards@gmail.com

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 
 */

/**
 * This file contains PINYIN text functions
 */

String.prototype.contains = function(s) { return this.indexOf(s) >= 0;};

function applyTone(newpinyin, tone) {
	var j;
	for (j = newpinyin.length -1; j >= 0; j--) {
		// look for the fin vowels of the pinyin word
		var f = newpinyin.charAt(j);
		var foundVowels = false;
		if (!foundVowels && ('ngr'.contains(f.toLowerCase()))) {
			// this is part of the ending
			continue;
		} else if ('aeiouü'.contains(f.toLowerCase())) {
			foundVowels = true;
			continue;
		} else {
		  // it's not a vowel, it's not a consonant at the end of the fin,
		  // therefore we've found the whole fin
		  break;
		}
	}
	// at this point j points to the char BEFORE the start of the fin 
	j++;
	if (j == newpinyin.length) {
	  // didn't find any vowels, this number is out of place in pinyin, let's just skip it
	  return newpinyin;
	}
	// because we added 1 to j above, newpinyin.substring(j) gives us the fin
	var fin = newpinyin.substring(j);
	newpinyin = newpinyin.substring(0, j);
	
  var ind = fin.toLowerCase().indexOf('a');
  if (ind >= 0) {
    fin = fin.substring(0, ind) + getTone(fin.charAt(ind),tone) + fin.substring(ind + 1);
  } else {
    ind = fin.toLowerCase().indexOf('e');
    if (ind >= 0) {
      fin = fin.substring(0, ind) + getTone(fin.charAt(ind),tone) + fin.substring(ind + 1);
    } else {
      ind = fin.toLowerCase().indexOf('ou');
      if (ind >= 0) {
      	fin = fin.substring(0, ind) + getTone(fin.charAt(ind),tone) + fin.substring(ind + 1);
      } else {
      	// find the last vowel, apply the tone mark to that
      	for (var k = fin.length -1; k >= 0; k--) {
      	  if ('aeiouü'.contains(fin.charAt(k).toLowerCase())) {
      	    fin = fin.substring(0, k) + getTone(fin.charAt(k),tone) + fin.substring(k + 1);
      	    break;
      	  }
      	} 
      }
    }
  }
	newpinyin = newpinyin + fin;
	return newpinyin;
}

function getTone(ch, tone) {
  if (ch == 'ü') {
    ch = 'v'; // hack: can't use ü as an object member name
  } else if (ch == 'Ü') {
  	ch = 'V';
  }
  var o = { 
 a: { 1: 'ā', 2: 'á', 3: 'ă', 4: 'à', 5: 'a'},
 e: { 1: 'ē', 2: 'é', 3: 'ĕ', 4: 'è', 5: 'e'},
 i: { 1: 'ī', 2: 'í', 3: 'ĭ', 4: 'ì', 5: 'i'},
 o: { 1: 'ō', 2: 'ó', 3: 'ǒ', 4: 'ò', 5: 'o'},
 u: { 1: 'ū', 2: 'ú', 3: 'ŭ', 4: 'ù', 5: 'u'},
 v: { 1: 'ǖ', 2: 'ü´', 3: 'ǚ', 4: 'ǜ', 5: 'ü'},
 
 A: { 1: 'Ā', 2: 'Á', 3: 'Ă', 4: 'À', 5: 'A'},
 E: { 1: 'Ē', 2: 'É', 3: 'Ĕ', 4: 'È', 5: 'E'},
 I: { 1: 'Ī', 2: 'Í', 3: 'Ĭ', 4: 'Ì', 5: 'I'},
 O: { 1: 'Ō', 2: 'Ó', 3: 'Ǒ', 4: 'Ò', 5: 'O'},
 U: { 1: 'Ū', 2: 'Ú', 3: 'Ŭ', 4: 'Ù', 5: 'U'},
 V: { 1: 'Ǖ', 2: 'Ü´', 3: 'Ǚ', 4: 'Ǜ', 5: 'Ü'}
 
    };
  var val = (o[ch] !== undefined ? (o[ch][tone] !== undefined ? o[ch][tone] : ch) : ch);
  if (val !== undefined) {
    return val;
  } else {
    return ch;
  }
}


/**
 * Normalizes Pinyin to a proper UTF-8 
 * representation with proper tone marks, umlauts, etc.
 */ 
function normalizePinyin(pinyin) {
  // pinyin contains numeric tones
  // convert tones to accents
  var newpinyin = '';
  for (var i = 0; i < pinyin.length; i++) {
    var c = pinyin.charAt(i);
    if (c.toLowerCase() == 'v') {
      // pinyin can't contain a v
      // sometimes v is used as a shorthand for ü
      if (c == 'V') {
      	newpinyin += 'Ü';
      } else {
      	newpinyin += 'ü';
      }
    } else if ('12345'.contains(c)) {
			// if c is a number, it represents a tone
		  newpinyin = applyTone(newpinyin, c);
    } else {
      newpinyin += c;
    }
    
  }
  return newpinyin;
}
