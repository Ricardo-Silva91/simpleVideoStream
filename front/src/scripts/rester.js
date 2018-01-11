
import $ from 'jquery';

import general_methods from './general_methods';

export const refreshLists = (cb) => {

    const url = general_methods.backendUrl + '/refreshVideoList';

    $.ajax({
        type: "POST",
        url: url,
        data: {},
        contentType: 'application/json',
    });

};