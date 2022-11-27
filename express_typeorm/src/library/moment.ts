import * as moment from 'moment';

export const transformStringToDate = async (stringDate: string) =>
    moment(stringDate).format("YYYY-MM-DD HH:MM:SS")

export const currentDate = async () => 
    moment(new Date()).format("YYYY-MM-DD HH:MM:SS")
