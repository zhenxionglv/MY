<?php
    $counter = file_get_contents('sae:stor://test/test.txt');
    $counter = intval($counter);//转成整形
    $counter++;
    file_put_contents('test.txt',$counter);
    echo "page view is :$counter";