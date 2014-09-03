#!/usr/bin/perl
# 2013/11/28
# Josh Tsai
# Ver 1.0.0
#
# �w�ɺʱ� Daemons�A�Y�o�{������h�Ұ� Daemon
#
use IO::Handle;
use FindBin;

# �ʱ��{�ǦW��
my $proc_name = "node";
my $exec_proc_name = "start.sh";

# �{��������|�A�ѵ{���۰ʨ��o�A�L���]�w
my $exec_path;
&get_exec_path();

#############################################################################
## Main 
#############################################################################

my ($result,$pid) = &check_proc_from_ps_by_name($proc_name);

&get_exec_path();
#my $proc_path = $exec_path."/".$exec_proc_name;
#my $proc_path = "node /home/ubuntu/SUPPLIER/app \"/home/ubuntu/SUPPLIER/logs/$(date +%F).log\" &";
my $proc_path = "sh /home/ubuntu/SUPPLIER/start.sh";

print "********************** result,pid = $result, $pid \n";
print "********************** proc_name,proc_path = $proc_name,$proc_path \n";

if($result != 1 ){		
	# �g log
	print "openstack_proc_checker:$proc_name is not running, try to startup $proc_path...\n";
	# �Ұ� proc
	&start_proc($proc_path);
}


#############################################################################
## �B�z proc 
#############################################################################

# �q ps ���ˬd process �O�_�s�b�A�^�ǵ��G�P pid
sub check_proc_from_ps_by_name()
{

	my ($proc_name) = @_;
	my $result = 0;
	my $return_pid;
	my @msg = qx(/bin/ps aux);

	foreach my $record (@msg)
	{
		if ($record =~ /$proc_name/) 
		{
			$result = 1;
			#print "proc:$record\n";
			my @ps_split = split( /\s+/, $record) ;
			$return_pid = $ps_split[1];		
		}
	}
	print "result:$result\n";
	print "return_pid:$return_pid\n";
	return $result,$return_pid;
}

# �R�� perl process 
sub kill_proc()
{
	my($pid) = @_;
	# �R�� process
	my @msg = qx(sudo kill -9 $pid);
	#logMessage(@msg);
}

#############################################################################
## Start proc
#############################################################################
sub start_proc()
{
	my ($proc_path) = @_;
	my $result = 0;
	system("$proc_path");
}

#############################################################################
## Util
#############################################################################

sub getDTime {
    my ($s, $m, $h, $dd, $mm, $yy) = localtime();
    my $mtime = sprintf("%.4d-%.2d-%.2d_%.2d:%.2d:%.2d",
        $yy+1900, $mm+1, $dd, $h, $m, $s);
    return $mtime;
}

sub trim {
    my ($msg) = @_;
    $msg =~ s/\s+$//;
    return $msg;
}

# ���o�{��������|
sub get_exec_path
{
	$exec_path = $FindBin::Bin;
	$exec_path =~ s/\s+$//;
}
