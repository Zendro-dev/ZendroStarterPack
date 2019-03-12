#!/bin/bash

# quit on first error
set -e

# find the project root folder
PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd ../ >/dev/null && pwd )"
echo "PROJECT_ROOT = ${PROJECT_ROOT}"
export PROJECT_ROOT

# echo with RED color (used for dangerous operations)
function r_echo(){
    echo -e "\033[0;31m$@\033[0m"
}

# echo with YELLO color (used for warnings and important notifications)
function y_echo(){
    echo -e "\033[1;33m$@\033[0m"
}

# check for confirmation
# example usage:
# if read_confirm; then echo "confirmed"; fi
function read_confirm(){
    read  ANSWER </dev/tty

    if [[ ${ANSWER} =~ ^[Yy]$ ]]
    then
        return 0 #TRUE (success execution return code)
    else
        return 1 #FALSE (failed execution return code)
    fi
}

# ask particular file before it's replacement
# param 1 - full path to the target file (that will be replaced)
# param 2 - full path to the source file
function prompt_replace_file(){
    local FROM=${1}
    local TO=${2}
    local FILE_NAME=$(basename ${FROM})

    if [[ -f ${TO} ]]
    then

        # do nothing if files are the same
        if cmp --silent "${FROM}" "${TO}"; then return 0; fi

        r_echo " ${TO} already exist and differs from"
        r_echo " ${FROM}, replace it anyway? (y/n)"
        if read_confirm; then cp -v  "${FROM}" "${TO}"; fi

    else
        cp -v  "${FROM}" "${TO}"
    fi
}

# copy files from "source" folder to the "target" folder
# each time asking if target file with the same name already exist
# param 1 - full path to the target folder
# param 2 - full path to the source folder
function prompt_migrate_folder(){

    local SRC=${1}
    local TARGET=${2}

    if ! [[ -z "$(ls -A ${SRC})" ]]
    then
        mkdir -pv ${TARGET}

        ls ${SRC} | while read FILE_PATH
        do
            local FILE_NAME=$(basename ${FILE_PATH})
            prompt_replace_file "${SRC}/${FILE_NAME}" "${TARGET}/${FILE_NAME}"
        done
    fi

}

