import dayjs from 'dayjs'
// by convention, composable function names start with 'use'
export function useDateHelpers() {
	// state encapsulated and managed by the composable
	function getWeekDay(date) {
		const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
		return daysOfWeek[dayjs(date).day()]
	}

	function getMonthName(date) {
		return dayjs(date).format('MMMM')
	}

	function getDay(date, without_ordinal = false) {
		var ordinals = ['st', 'nd', 'rd', 'th']
		var day_human = dayjs(date).format('D')
		var parsed_day_human = parseInt(day_human)
		var day = day_human.slice(-1)
		var max = parseInt(day) >= 4 || parseInt(day) === 0 ? 3 : parseInt(day) - 1
		var ordinal = parsed_day_human >= 11 && parsed_day_human <= 13 ? ordinals[3] : ordinals[max]
    if(without_ordinal)
      return day_human
    else
		  return day_human + ordinal
	}

	function getFullDate(date) {
		return getWeekDay(date) + ' ' + getDay(date) + ' ' + getMonthName(date) + ' ' + dayjs(date).year()
	}

	function getMonthDate(date) {
		return getDay(date) + ' ' + getMonthName(date)
	}

	function getTodayDate() {
		return dayjs(new Date())
	}

	function convertDateFormat(date, inputFormat, outputFormat) {
		var customParseFormat = require('dayjs/plugin/customParseFormat')
		dayjs.extend(customParseFormat)
		return dayjs(date, inputFormat).format(outputFormat)
	}

	function dateToUKDate(date) {
		return dayjs(date).format('DD/MM/YYYY')
	}

	function addTimeToDate(date, timeToAdd, range) {
		// example: .add(6, 'months')
		return dayjs(date).add(timeToAdd, range)
	}
	function bdateToString(date, format) {
		return dayjs(date).format(format)
	}
	// expose managed state as return value
	return {
		getWeekDay,
		getMonthName,
		getDay,
		getFullDate,
		getMonthDate,
		getTodayDate,
		convertDateFormat,
		dateToUKDate,
		addTimeToDate,
		bdateToString,
	}
}
