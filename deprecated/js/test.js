const glob_time_info = {elapsed_time: 0.0, delta_time: 0.0, time_ratio: 0.0, last_frame: performance.now()};

var render = function (timestamp) {
	glob_time_info.delta_time = timestamp - glob_time_info.last_frame;
	glob_time_info.time_ratio = glob_time_info.delta_time / 1000;
	glob_time_info.elapsed_time += glob_time_info.delta_time; 
	glob_time_info.last_frame = timestamp; 
};
render(performance.now());