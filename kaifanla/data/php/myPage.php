<?php
    $counter = file_get_contents('sae:stor://test/test.txt');
    $counter = intval($counter);//ת������
    $counter++;
    file_put_contents('test.txt',$counter);
    echo "page view is :$counter";