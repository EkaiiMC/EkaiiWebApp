"use server";

import Link from "next/link";
import Image from "next/image";
import {ReactNode} from "react";

export async function PackSkeleton({type}: { type: "ekaii-lite" | "ekaii-plus"}) {
  const typeLogo = type === 'ekaii-lite' ? '/images/ekaii-lite.svg' : '/images/ekaii-plus.svg';

  return (
    <div className={'bg-bgLightGray border-bgDarkGray border-2 ml-auto mr-auto flex flex-row justify-center w-[900px]'}>
      <div className={'w-[200px] p-3 ml-3 mt-auto mb-auto'}>
        <Image src={typeLogo} width={583} height={512} alt={`logo ${type}`}/>
      </div>
      <div className={'flex flex-col items-center p-3 w-2/5'}>
        <h2 className={'text-2xl text-left w-full shadow-underline'}>v</h2>
        <div className={'flex flex-col items-center w-full mt-5 text-xl'}>
          <GrayButton href={''} disabled={true} text={'Github'} />
          <PinkButton href={''} disabled={true} text={'Curseforge (.zip)'} />
          <PinkButton href={''} disabled={true} text={'Modrinth/MultiMC (.mrpack)'}/>
        </div>
      </div>
      <div className={'flex flex-col items-center p-3 w-2/5'}>
        <h2 className={'text-2xl text-left w-full shadow-underline'}>Anciennes versions</h2>
      </div>
    </div>
  )
}

export async function PinkButton({href, text, disabled}: { href: string, text: string, disabled?: boolean}) {
  const disableClass = disabled ? 'pointer-events-none' : '';
  return (
    <Link href={href}
          className={`p-2 bg-basePink border-darkPink border-2 hover:bg-pinkText transition-all duration-200 ease-in-out w-full text-center mt-1 mb-1 ${disableClass}`}>{text}</Link>
  )
}

export async function GrayButton({href, text, disabled}: { href: string, text: string, disabled?: boolean }) {
  const disableClass = disabled ? 'pointer-events-none' : '';
  return (
    <Link href={href} className={`p-2 bg-bgGray border-bgDarkGray border-2 hover:bg-bgDarkGray hover:border-bgGray transition-all duration-200 ease-in-out w-full text-center mt-1 mb-1 ${disableClass}`}>{text}</Link>
  )
}

export async function Pack({className, type}: {className?: string, type: "ekaii-lite" | "ekaii-plus"}) {
  const typeLogo = type === 'ekaii-lite' ? '/images/ekaii-lite.svg' : '/images/ekaii-plus.svg';
  const repo = type === 'ekaii-lite' ? 'EkaiiLite' : 'EkaiiPlus';

  const latestRelease = await fetch(`https://api.github.com/repos/EkaiiMC/${repo}/releases/latest`, {cache: 'no-cache'});
  if(!latestRelease.ok) throw new Error('Failed to fetch latest release');
  const latestReleaseJson : {tag_name: string, html_url: string, assets: {name: string, browser_download_url: string}[]} = await latestRelease.json();
  const latestVersion = latestReleaseJson.tag_name;
  console.log(latestReleaseJson);
  const latestReleaseUrl = latestReleaseJson.html_url;
  let curseforgeUrl = '';
  let modrinthUrl = '';
  latestReleaseJson.assets.forEach(asset => {
    if(asset.name.includes('curseforge')) curseforgeUrl = asset.browser_download_url;
    if(asset.name.includes('modrinth')) modrinthUrl = asset.browser_download_url;
  });

  const olderReleases = await fetch(`https://api.github.com/repos/EkaiiMC/${repo}/releases`, {cache: 'no-cache'});
  if(!olderReleases.ok) throw new Error('Failed to fetch older releases');
  const olderReleasesJson : {tag_name: string, html_url: string}[] = (await olderReleases.json()).slice(0,4);
  const olderReleasesList : ReactNode[] = olderReleasesJson.map(release => {
    if (release.tag_name === latestVersion) return;
    return (
      <GrayButton key={release.tag_name} href={release.html_url} text={release.tag_name} />
    );
  }).filter((release) => release !== undefined);

  return (
    <div className={className}>
      <div className={'w-[200px] p-3 ml-3 mt-auto mb-auto'}>
        <Image src={typeLogo} width={583} height={512} alt={`logo ${type}`}/>
      </div>
      <div className={'flex flex-col items-center p-3 w-2/5'}>
        <h2 className={'text-2xl text-left w-full shadow-underline'}>{latestVersion}</h2>
        <div className={'flex flex-col items-center w-full mt-5 text-xl'}>
          <GrayButton href={latestReleaseUrl} text={'Github'} />
          <PinkButton href={curseforgeUrl} text={'Curseforge (.zip)'} />
          <PinkButton href={modrinthUrl} text={'Modrinth/MultiMC (.mrpack)'}/>
        </div>
      </div>
      <div className={'flex flex-col items-center p-3 w-2/5'}>
        <h2 className={'text-2xl text-left w-full shadow-underline'}>Anciennes versions</h2>
        <div className={'flex flex-col items-center w-full mt-5 text-xl'}>
          {olderReleasesList}
        </div>
      </div>
    </div>
  )
}