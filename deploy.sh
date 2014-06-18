remoteVolume="//cpowell@fi--didewd1.dide.local/C\$/inetpub/"
localVolume="/Users/Chris/WD1"

if mount|grep $localVolume > /dev/null; then
    echo "Volume already mounted"
else
    mount -t smbfs $remoteVolume  $localVolume
fi

git push deploy master

umount $localVolume
